---
title: Microcks 1.5.2 release 🚀
slug: microcks-1.5.2-release
date: '2022-06-02'
image: /images/blog/microcks-1.5.2-feature.png
authors:
  - laurent-broudoux
description: We are delighted to announce the 1.5.2 release of Microcks - the Open source Kubernetes-native tool for API Mocking and Testing.
---

We are delighted to announce the `1.5.2` release of Microcks - the Open source Kubernetes-native tool for API Mocking and Testing. This is mainly an “Enhancement release” pushing further the [Microcks’ Hub and Marketplace](/blog/microcks-hub-announcement/) we introduced a few weeks ago.

<!-- truncate -->

In our vision, the Hub will hold a central place that will allow Microcks users to easily reuse curated API Mocks & Test suites in a single click - but also to share and publish their own. That’s why we absolutely wanted to have a nice **integration between the Hub and Microcks** - and that’s the purpose of this release.

![microcks 1.5.2 feature](/images/blog/microcks-1.5.2-feature.png)

But as we have a vibrant community out there, it makes no-sense to not also embed some enhancements that were required for them. Kudos once again to all or supporters that help finding bugs 🐞, suggesting enhancements but also testing the fixes 👏. See greetings below.

Let’s do a quick review of what’s new.

## Hub integration FTW!

[hub.microcks.io](https://hub.microcks.io) and Microcks are now fully integrated and you can take all advantages of our new community hub and free marketplace where ever you need: **on-premise**, in the **cloud**, or go **fully hybrid** 👍 \
 \
A new `Microcks Hub` menu entry is now available by default in the vertical navigation bar. Access to this new entry can of course be restricted to certain roles in your organization or totally removed if needed (by setting the ``microcksHub.enabled`` property to `false`).

![microcks 1.5.2 hub](/images/blog/microcks-1.5.2-hub.png)

Microcks samples you used to add manually as described in our [Getting Started](/documentation/tutorials/getting-started/#loading-a-sample) documentation or either [standard APIs samples](/blog/microcks-hub-announcement/#openbankingorguk-use-case) can be directly discovered and browsed from your instance.

![microcks 1.5.2 package](/images/blog/microcks-1.5.2-package.png)

When choosing a specific API version, you have access to its detailed information. You can also directly choose to **install it **by clicking the button. From that point, you will have 2 options:

* Install it with `+ Add an Import Job`. This will in fact create a [new automatic and scheduled import](/documentation/guides/usage/importing-content/#creating-a-new-scheduled-import) for you. So that subsequent updates of this API will be automatically propagated to your instances,
* Install it with a `+ Direct Import` which means that the import will only be made once and you’ll have to re-run the install for updates.

![microcks 1.5.2 install](/images/blog/microcks-1.5.2-install.png)

> Hub integration is a very practical way to speed-up your bootstrap with Microcks but also to browse and reuse standard APIs. Please see our latest blog post regarding Microcks’ hub for further information 📖[https://microcks.io/blog/microcks-hub-announcement/](/blog/microcks-hub-announcement/)

## Other enhancements

### Postman URLs correct fallback

There's a bug when defining an API operation using Postman Collections and templates (eg. URL with `/path/:param/sub` for example) with `FALLBACK` dispatching strategy.

Without an exact match, Microcks tries to find the correct operation with pattern matching. It appears that the regular expression used to match the operation path and find the correct operation the mock URL is attached to was not correct.

> Thanks a lot to [Madiha Rehman](https://www.linkedin.com/in/madihar/) 🙏 that found this bug and helps validating the fix (see [#597](https://github.com/microcks/microcks/issues/597)).

### Fix GitLab file name and references resolution

As GitLab URLs are build with an encoded path and a filename that is not located at the end of URL (aka

`https://gitlab.com/api/v4/projects/35980862/repository/files/folder%2Fsubfolder%2Ffilename/raw?ref=branch`), we realized that we cannot just extract the last part of the URL to get the file name.

This leads to inconsistent behavior when using [Multi-artifacts support](/documentation/explanations/multi-artifacts/): all source artifacts being identified as `raw?ref=branch`, they are overwritten when importing different artifacts successively. More-over this breaks the reference resolution mechanism that also relies on simple no encoding file name and path in repository URL.

To get around this specific encoding we have set-up something more sophisticated so that Microcks will be well prepared to handle other encoding implementations in the future.

> Thanks a lot to [@imod](https://github.com/imod) 🙏 for reproducing scenarios and hints on how GitLab provides information on encoded filename (see [#605](https://github.com/microcks/microcks/issues/605)).

## What’s coming next?

As usual, we will be eager to prioritize items according to community feedback: you can check and collaborate via our list of [issues on GitHub](https://github.com/microcks/microcks/issues). 

Remember that we are an open community, and it means that you too can jump on board to make Microcks even greater! Come and say hi! on our [Github discussion](https://github.com/microcks/microcks/discussions) or [Discord chat](https://microcks.io/discord-invite/) 🐙, simply send some love through [GitHub stars](https://github.com/microcks/microcks) ⭐️ or follow us on [Twitter](https://twitter.com/microcksio), [LinkedIn](https://www.linkedin.com/company/microcks/) and our brand new [YouTube channel](https://www.youtube.com/c/Microcks)!

Thanks for reading and supporting us! 
