```diff
- DO NOT BORK MY REPO 
+ Press the *Use this template* button
``` 

# Veeva Approved Email - Package manager 

> This tool is designed to help streamline the building, testing and deployment of Veeva Approved Emails with fragments. It has already been used in a production environment for multiple projects.
>
> This tool will provide you with a simple way to view the VAE template in a browser, with all fragments included, and to provide you with the packaged template and fragments as per Veeva requirements. 

*FYI: If you need to paste it into Outlook, then you'll need to open the template directly from Windows, and  not via PhpStorm.*

## Quick start...

- Copy these files into a new project folder
- Run `npm install`
- Run `gulp setup`
- Then start creating your fragments:
  - Run `gulp fragment --n "Fragment Name" --t a` for each fragment you want to create
  - Sensible names please, no silly characters
      - Use the partial-template's single character ID to import the partial-template html into your partial 
- Then start creating your partials:
  - Run `gulp partial --n "Partial Name" --t a` for each partial you want to create
    - Sensible names please, no silly characters
    - Use the partial-template's single character ID to import the partial-template html into your partial 

> All new partials added by you will be hyphenated where you have spaces, and will also have a unique id number added to the start, e.g. `5-partial-name`. This is to stop you overwriting your existing partials by accident. The id means nothing. 

- [How to configure your template styles](#Adding-dynamic-stylescontent).

- [Examples of the existing partial-templates](#Current-partial-options). 

- [Gulp Tasks](#Gulp-Tasks-and-Workflow). 

- [Making fragments](#Making-a-fragment).

## Useful Veeva stuff 

Stop Android trying to make numbers >3 digits into phone numbers by adding `&zwnj;`: 
```
12&zwnj;34
```
Salutaion:  
```
<p style="{{P1}}">Dear {{accTitle}} {{accFname}} {{accLname}}</p>
```
Sign-off: 
```
<p style="{{P1}}">{{userName}}</p>
```
Linked Vault document: 
```
<p style="{{P1}}">Link to a document in Vault: <span style="color:{{C2}};"><a style="color:{{C2}};" href="{{add the document id num}}">Link goes here</a></span></p>
```
And the all important black triangle: 
```
<span style="color:{{BLACK}};">&#9660;</span>
```
Get in touch link: 
```
<table cellpadding="0" cellspacing="0" border="0" style="{{STANDARD_TABLE}}" bgcolor="{{WHITE}}" width="610">
    <tr>
        <td align="right" valign="middle" width="30">
            <img alt="" src="images/calendar.png" width="30px" height="30px" style="display:block;border:0;"/>
        </td>
        <td width="10"></td>
        <td align="left" valign="middle" width="570">
            <p style="{{P1}}"><span style="color:{{C2}};"><a style="color:{{C2}};" href="mailto:{{userEmailAddress}}?subject=I would like to arrange a meeting to discuss Takhzyro">I would like to arrange a meeting</a></span><br/></p>
        </td>
    </tr>
</table>
```

## File structure

You'll need to make the following folder structure which can be done by running `$ gulp setup`: 

```
root/
|—— build/
|—— dist/
|—— src/
|   |—— fragments/
|   |—— images/
|   |—— template/
|
|—— gulfile.js
|—— package.json
```

The `template` folder will contain you Veeva Approved Email template. It doesn't matter what your `html` file is called. 

Each fragment needs to go in its own folder in `fragments`. You should give your fragment `html` files sensible, relevant names. 

## Gulp Tasks and Workflow

Menu | Gulp task | Action
---- |--------- | ------
[Read](#Watch) | `$ gulp` | Watch the `src` folder for changes
[Read](#Setup) | `$ gulp setup` | Setup the project folder structure
[Read](#Fragments) | `$ gulp fragment --n "Fragment name" --t id` | Create a new fragment (optionally you can add the template id (a, b, ...k)
[Read](#Partials) | `$ gulp partial --n "Partial name" --t id` | Create a new partial (optionally you can add the template id (a, b, ...k)
[Read](#Build) | `$ gulp build` | Deploy task - compiles the template for local preview
[Read](#Distribution) | `$ gulp dist` | Deploy task - compiles the template for Veeva 


### In depth

#Watch

```
$ gulp
```
Watch the `partials`, `fragments`, `images`, and `template` files for changes and run the `build` command automatically. 

You may like to implement something to refresh your browser when this command runs but I prefer to press F5 myself. Here's an example of how to implement a live reload if that's what you're into: <https://stackoverflow.com/questions/43415506/how-to-make-a-refresh-in-browser-with-gulp/43463567>

[Back to menu](#Gulp-Tasks-and-Workflow)

---

# Setup

```
$ gulp setup
```
Create the project folder structure:

```
root/
|—— build/
|—— dist/
|—— src/
|   |—— fragments/
|   |—— images/
|   |—— template/
|   |   |—— partials/
|   |   |   |—— fragment-list.html
```

This will create an empty template file for you, and the associated image folder for that template. 

The template filename doesn't actually matter so rename it if you like; anything will do as long as it's a sensible file name. *DO NOT* change the name of the template image folder. It *must* be called `template`. 

When adding images for a fragment, you need to put those images in a folder with the fragment name. The image name doesn't matter: 

```
root/
|—— src/
|   |—— fragments/
|   |   |—— fragment-name-1.html
|   |—— images/
|   |   |—— fragment-name-1/
|   |   |   |—— an-image.png
|   |   |   |—— another-image.jpg
```

Template images obviously go into `images`>`template`. 

```
root/
|—— src/
|   |—— images/
|   |   |—— template/
|   |   |   |—— an-image.png
|   |   |   |—— another-image.jpg
|   |—— template/
|   |   |—— your-template.html
```

[Back to menu](#Gulp-Tasks-and-Workflow)

---

# Fragments

```
$ gulp fragment --new "Fragment name"
```
This will create an empty fragment `html` file in fragments and an empty images folder in images with the same name. 

```
root/
|—— src/
|   |—— images/
|   |   |—— your-new-fragment/
|   |—— fragments/
|   |   |—— your-new-fragment.html
```

[Back to menu](#Gulp-Tasks-and-Workflow)

---

# Partials

```
$ gulp partial --new "Partial name"
```
This will create a duplicate of the specified partial template `html` file in partials and an empty images folder in images with the same name. 

```
root/
|—— src/
|   |—— images/
|   |   |—— template/
|   |   |   |—— your-new-partial/
|   |—— template/
|   |   |—— partials/
|   |   |   |—— your-new-partial.html
```

[Back to menu](#Gulp-Tasks-and-Workflow)

---

# Making a fragment 

This VAE packaging system requires that images in your fragment are loaded from `root`>`images`. Remember that fragments in Veeva always use a table format and the content is always encapsulated in `<tr></tr>`. 

```
<tr>
  <td width="{{CONTENT_MARGIN}}"></td>
  <td width="{{COL1}}">
  
    <img alt="This is an image" src="images/your-image-name.png" width="200px" height="50px" style="display:block;border:0;" />
  
  </td>
  <td width="{{CONTENT_MARGIN}}"></td>
</tr>
```

#### Including fragments in the template for testing

Fragments are injected into the template using the following method and these references will be placed in the default partial `fragment-list.html`:

```
<table>
  <!-- inject:../fragments/fragment-name-1.html -->
  <!-- endinject -->

  <!-- inject:../fragments/fragment-name-2.html -->
  <!-- endinject -->

  {{insertEmailFragments[1,5]}}
</table>
```

This is only for the purpose of testing the email (with all fragments) in a web browser or, for example, uploading to Litmus for email client testing. 

[Back to menu](#Gulp-Tasks-and-Workflow)

---

# Build

```
$ gulp build
```
*All files and folders in `build` will be erased before this command runs*

Convert the fragments and template into a single `html` file for local testing: 

```
root/
|—— build/
|   |—— images/
|   |   |—— all.png
|   |   |—— the.png
|   |   |—— imgs.png
|   |—— template-with-embedded-fragments.html
```

- Compile the images into `build`>`images`
- Compile the fragments into the template to create a single `html` file which can be viewed in a web browser 
- Place the compiled `html` file in the `build` folder

[Back to menu](#Gulp-Tasks-and-Workflow)

---

# Distribution

```
$ gulp dist
```
*All files and folders in `dist` will be erased before this command runs*

Package the template and fragments in accordance with Veeva requirements: 

```
root/
|—— dist/
|   |—— fragment-name-1/
|   |   |—— images.zip
|   |   |—— index.html
|   |—— fragment-name-2/
|   |   |—— images.zip
|   |   |—— index.html
|   |—— template/
|   |   |—— images.zip
|   |   |—— index.html
```

- Copy the template into `dist`>`template` and rename to `index.html`
- Copy all the template images into an images folder, and into `images.zip` 

- Copy each fragment into `dist`>`fragment-name` and rename to `index.html`
- Copy all the fragment images into an images folder, and into `images.zip`, for each fragment 

---

# Adding dynamic styles/content

You can add dynamic content to the `config.json` files found in the project root. 

```
root/
|—— config.json
```

These will be used when running `gulp dist` and any matching content will be replaced. Anything you want replaced must be encapsulated in squiggly brackets, thus: `{{aThing}}`. Replacement strings cannot have spaces in them and are *probably* case-insensitive. 

```json
{
  "H1" : "font-size:24px;"
}
```

If you list your template colours last then you can use those colours in your other replacement strings, such as in font declarations within `config.json`. 

```json
{
  "C1" : "#000000",
  "C2" : "#005588",
  "C3" : "#777777",
  "C4" : "#FFFFFF"
}
```

So you could declare your fonts lower down the file too, and use those declarations higher up in the file. For instance, here I've defined `F1` and `B` below the headings and paragraph styles, so I can use `F1` to set the font and `B` to make it bold: 

```json
{
  "H1" : "{{F1}}{{B}}font-size:24px;line-height:30px;color:{{BLACK}};",
  "H2" : "{{F1}}{{B}}font-size:20px;line-height:26px;color:{{C2}};",
  "H3" : "{{F1}}{{B}}font-size:16px;line-height:20px;color:{{C2}};",
  "P1" : "{{F1}}font-size:12px;line-height:15px;color:{{C3}};",
  "P2" : "{{F1}}{{I}}font-size:10px;line-height:13px;color:{{C3}};",
  "F1" : "font-family:Arial,sans-serif;mso-line-height-rule:exactly;",
  "LINK" : "text-decoration:none;",
  "B" : "font-weight:bold;",
  "I" : "text-decoration:italic;",
  "U" : "text-decoration:underline;",
  "WHITE" : "#FFFFFF",
  "BLACK" : "#000000",
  "BGNDCOL" : "#f2f2f2",
  "C1" : "#330000",
  "C2" : "#005588",
  "C3" : "#777777",
  "C4" : "#FF33FF"
}
```

You literally don't have to do this if you don't want to. You could explicitly declare the font for each heading style, if that's your preference. 

[Back to menu](#Gulp-Tasks-and-Workflow)

# Current partial options

*EDIT: I've added a single column with background image (m) but this is not yet tested*

a_single-column

![Partial layout options](https://github.com/Makara-Health/vae-templating-system/blob/master/partial-templates/examples/a_single-column.png)

b_single-column-no-margin

![Partial layout options](https://github.com/Makara-Health/vae-templating-system/blob/master/partial-templates/examples/b_single-column-no-margin.png)

c_two-columns-1-1

![Partial layout options](https://github.com/Makara-Health/vae-templating-system/blob/master/partial-templates/examples/c_two-columns-1-1.png)

d_two-columns-1-2

![Partial layout options](https://github.com/Makara-Health/vae-templating-system/blob/master/partial-templates/examples/d_two-columns-1-2.png)

e_two-columns-1-2-no-margin

![Partial layout options](https://github.com/Makara-Health/vae-templating-system/blob/master/partial-templates/examples/e_two-columns-1-2-no-margin.png)

f_two-columns-1-3

![Partial layout options](https://github.com/Makara-Health/vae-templating-system/blob/master/partial-templates/examples/f_two-columns-1-3.png)

g_two-columns-1-3-narrow-margin

![Partial layout options](https://github.com/Makara-Health/vae-templating-system/blob/master/partial-templates/examples/g_two-columns-1-3-narrow-margin.png)

h_two-columns-2-1

![Partial layout options](https://github.com/Makara-Health/vae-templating-system/blob/master/partial-templates/examples/h_two-columns-2-1.png)

i_two-columns-3-1

![Partial layout options](https://github.com/Makara-Health/vae-templating-system/blob/master/partial-templates/examples/i_two-columns-3-1.png)

j_three-columns-1-1-1

![Partial layout options](https://github.com/Makara-Health/vae-templating-system/blob/master/partial-templates/examples/j_three-columns-1-1-1.png)

k_three-columns-1-2-1

![Partial layout options](https://github.com/Makara-Health/vae-templating-system/blob/master/partial-templates/examples/k_three-columns-1-2-1.png)

l_four-columns

![Partial layout options](https://github.com/Makara-Health/vae-templating-system/blob/master/partial-templates/examples/l_four-columns.png)

m_single-column-background

![Partial layout options](https://github.com/Makara-Health/vae-templating-system/blob/master/partial-templates/examples/m_single-column-background.png)

[Back to menu](#Gulp-Tasks-and-Workflow)