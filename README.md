## cdata's toolbox

This is a standard library of sorts that I use for personal projects and demos.

The "bag" contains common patterns and tools for state management that I find
myself writing repeatedly. The general emphasis of this library is to offer
feather-weight patterns that support using the best of modern app-building
patterns on the web.

Some of the "tricks" have better-known, better-tested and/or better-featured
alternatives. It is usually safe to assume that if some code makes its way here,
it is because one or more of the following things was true at the time it was
added:

 - Alternatives incurred more byte cost than I cared to take on in a project
 - Alternatives assume Node.js / CommonJS details, making them difficult to
   use and bundle
 - Alternatives are not suitable for use in conjunction with web components

In some cases there is also the most time honored of reasons for some code to be
here: because I felt like writing it myself 🖖

## Warning: pre-alpha status

Currently offered without tests, docs or any guarantee of API stability. GLHF!

## Development

### Commands

 - `npm run build` will build the full project, producing deployable artifacts
   in the `dist` folder.
 - `npm run watch` will watch all files in all relevant project directories for
   changes and build them as necessary
 - `npm run serve` will start a static web server with `dist` as the web root
 - `npm run dev` will do all three of the above things in order

### Layout

 - `src` contains raw TypeScript sources; compiled JavaScript artifacts go to
   the `lib` folder.
