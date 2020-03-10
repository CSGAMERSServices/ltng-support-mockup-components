# Overview

Please see the [Installation](#install) section below for more on how to install on your Sandbox / Demo org.

**Please note: sample code (metadata api and dx formats) are is also available in the [mdapi](./mdapi) and [dx](./dx) folders above**

---

```
This is a suite of components
that help you create 'Digital Paper Prototypes'
to help you and your customers quickly envision
what the Lightning Experience could be for them.
```

Whiteboarding is a common technique of structruing what we want to see and where. This is placing the building blocks so we can have meaningful discussions and make progress.

Sometimes, there can be difficulty in transitioning from Paper to their Salesforce Org.  The aim of this project is to help with that transition.

![App Page](docs/images/ExampleAppPage.png)

*  Explore what Standard Components you have available to you
*  Add in Mockups / Placeholders to brainstorm what you want
*  Create a compelling story to share with others
*  Perform A-B testing or "Digital Paper Prototypes" to get feedback

Then one by one, replace your Mockups to make it real.

---

NOTE: This project is for demonstration purposes.
For more information, please see the [Licensing](#licensing) section below

# How to Use


[Create pages within the App Builder](https://trailhead.salesforce.com/en/content/learn/modules/lightning_app_builder/lightning_app_builder_intro) and use the standard components and the provided Mockup Components below...

@TODO ... include more on structuring discussions...

## Rich Text (Standard)

One of the most important components with your Digital Paper Prototypes is the Standard Rich Text component.

![Screenshot of the Rich Text Component](docs/images/richTextComponent.png)

Use this to capture Text information and notes.
(Which fields / types of information to show, etc)

## Placeholders

Placeholders are for times we want to be quick, or sizing is important.

![Screenshot of Placeholders](docs/images/placeholderComponent.png)

Note that this is quite a bit easier size than it would be on a rich text.

## Mockup Image

Sometimes we know what we want things to look like, but it isn't available in Lightning ... yet.

![Screenshot of Image Placeholder](docs/images/imageComponent.png)

The Mockup Image shows a static resource, and can be clicked upon to navigate to another place within Salesforce.

## Responsive Table

Lightning Experience gives the ability to work with Salesforce from the Mobile Phone and from Desktop.

Tables tend to have quite a bit of data, and should not generally look the same on Phones as they should from Desktop.

![Screenshot of tables on Desktop](docs/images/tableDesktop.png)

Instead of cramming as much information together, sometimes a different approach is warranted.

![Screenshot of tables on Phone](docs/images/tablePhone.png)

The information is simply a CSV (comma separated value - text)

Simply separate cells (values) with commas,
Optionally wrap cells within quotes - if there are commas,
and separate each line by pressing return.8

**NOTE:** If the browser doesn't support separating by new lines
(by pressing the return key or pasting where the lines are separated already)
then please include `\n` (or `\r`) between lines.


# TLDR How

* Bullet_points_of_how_this_was_done

---

# Install

There are three methods available for you to install this demo, so you can play around with it:

(Please note, all are intended as demonstrations and are not intended for deployment to Production as is)

* [Install via URL](#install-via-url)
* [Install Demo via Salesforce CLI](#install-via-salesforce-cli)
* [Install Demo via Ant/Metadata API](#install-via-metadata-api)

## Install via URL

This works very similar to an App Exchange install.

Please login to an available sandbox and click the link below.

[https://test.salesforce.com/packaging/installPackage.apexp?p0=04t3s000003OodrAAC](https://test.salesforce.com/packaging/installPackage.apexp?p0=04t3s000003OodrAAC)

(or simply navigate to `https://YOUR_SALESFORCE_INSTANCE/packaging/installPackage.apexp?p0=04t3s000003OodrAAC` <br />
if you are already logged in)

![Install for Admins](docs/images/installPackage.png)

It is recommended to install for Admins Only (but all options will work)

##### Run the Demos

Thats it. See the [How to Use](#how-to-use) section for how to use the app.

## Installing via the Salesforce CLI

This assumes you have already installed the [Salesforce CLI]() and [Connected the Salesforce CLI to your org](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_web_flow.htm).

However, the Salesforce CLI can be used with any org and does not require Salesforce DX to be enabled. (Although enabling the DX / Dev Hub would give some great benefits, and would only require care of [certain object permissions: Scratch Org Info, ActiveScratchOrg, NamespaceRegistry](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_add_users.htm) - as they are not available in all orgs)

**1.** Run the following command:

	sfdx force:mdapi:deploy -d mdapi -u [[orgAlias]] -w
	

##### Run the Demos

Thats it. See the [How to Use](#how-to-use) section for how to use the app.

	sfdx force:org:open -u [[orgAlias]]
	
# Licensing

Copyright 2020 Salesforce

(MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.