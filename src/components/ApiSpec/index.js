import React, {useEffect, useRef, useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useColorMode} from '@docusaurus/theme-common';

const escapeAttr = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function openApiDoc(url, base) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${base}swagger-ui/swagger-ui.css">
<script src="${base}swagger-ui/swagger-ui-bundle.js"></script>
<script src="${base}swagger-ui/swagger-ui-standalone-preset.js"></script>
<style>:root{color-scheme:light}body{margin:0;background:#fff;font-family:sans-serif}.swagger-ui .info .title small,.swagger-ui .info .title small pre{background:#4a5160!important;color:#fff!important}.swagger-ui .info .title small:nth-of-type(2){background:#3a6b00!important}.swagger-ui .info a,.swagger-ui .info .url,.swagger-ui .info__license .link{color:#1a5f9e!important}.swagger-ui .opblock-get .opblock-summary-method{background:#1b62b3!important}.swagger-ui .opblock-post .opblock-summary-method{background:#1a7048!important}.swagger-ui .opblock-put .opblock-summary-method{background:#955200!important}.swagger-ui .opblock-delete .opblock-summary-method{background:#c02020!important}.swagger-ui .opblock-patch .opblock-summary-method{background:#0f766e!important}.swagger-ui .btn.authorize,.swagger-ui .btn.authorize span{color:#1a7048!important}.swagger-ui .btn.authorize svg{fill:#1a7048!important}</style></head>
<body><div id="ui"></div>
<script>window.onload=function(){SwaggerUIBundle({url:"${escapeAttr(url)}",dom_id:"#ui",queryConfigEnabled:false,
presets:[SwaggerUIBundle.presets.apis,SwaggerUIStandalonePreset.SwaggerUIStandalonePreset]});
new ResizeObserver(function(){parent.postMessage({apiSpecHeight:document.documentElement.scrollHeight},"*")}).observe(document.body);
new MutationObserver(function(){document.querySelectorAll('select:not([aria-label])').forEach(function(s){s.setAttribute('aria-label','Select an option')})}).observe(document.body,{childList:true,subtree:true})}</script>
</body></html>`;
}

function asyncApiDoc(url, dark) {
  return `<!doctype html><html><head><meta charset="utf-8">
<script src="https://unpkg.com/@asyncapi/web-component@2.4.3/lib/asyncapi-web-component.js" defer></script>
<style>body{margin:0;font-family:sans-serif;${dark ? 'background:#1e262c;color:#cbcbcb' : ''}}</style></head>
<body><asyncapi-component schemaUrl="${escapeAttr(url)}" schemaFetchOptions='{"method":"GET","mode":"cors"}'
cssImportPath="https://unpkg.com/@asyncapi/react-component@2.4.3/styles/default.min.css"></asyncapi-component>
<script>new ResizeObserver(function(){parent.postMessage({apiSpecHeight:document.documentElement.scrollHeight},"*")}).observe(document.body)</script>
</body></html>`;
}

/** Renders an OpenAPI (Swagger UI) or AsyncAPI document from a remote URL inside a sandboxed iframe. */
function ApiSpecFrame({kind, url}) {
  const base = useBaseUrl('/');
  const {colorMode} = useColorMode();
  const ref = useRef(null);
  const [height, setHeight] = useState(600);

  useEffect(() => {
    const onMessage = e => {
      if (e.source === ref.current?.contentWindow && typeof e.data?.apiSpecHeight === 'number') {
        setHeight(e.data.apiSpecHeight + 16);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const srcDoc =
    kind === 'asyncapi' ? asyncApiDoc(url, colorMode === 'dark') : openApiDoc(url, `${window.location.origin}${base}`);

  return (
    <iframe
      ref={ref}
      title={kind === 'asyncapi' ? 'AsyncAPI specification' : 'OpenAPI specification'}
      srcDoc={srcDoc}
      sandbox="allow-scripts allow-same-origin allow-popups"
      style={{width: '100%', height, border: 0}}
    />
  );
}

export default function ApiSpec(props) {
  return <BrowserOnly fallback={<p>Loading specification…</p>}>{() => <ApiSpecFrame {...props} />}</BrowserOnly>;
}
