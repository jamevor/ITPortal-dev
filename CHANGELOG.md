# ITPortal

Current Version: 3.5.3

***

## 3.5.3

### Added

### Removed

### Changed

### Fixed

* Article contents editor was not escaping quotes in its data-content attribute.

***

## 3.5.2

### Added

* Subsites.

### Removed

### Changed

### Fixed

***

## 3.5.1

### Added

### Removed

### Changed

### Fixed

* Grading format form for graduate students.
* Article edit page now refreshes on save to prevent duplicate article.articleContents entries.
* Article view page now correctly shows article contents if they exist in the main section even if there is no main content.

***

## 3.5.0

### Added

* Screen reader text for the PWA back button and Hub logo.
* Grade Format Request Form.
* More common js and css to service worker caching.
* Article Content (so article main can have many sections).
* [WIP]Subsites.
* Gizmos for subsites to build queries.

### Removed

* Article internal no longer displays because there is no permissions infrastructure for it.

### Changed

* Updated editorjs to 2.17.0 (this should fix the multipaste issue).
* Max number of elements in related items search from 2 to 5 ti improve findability.
* Moved related articles on news and article pages to the sidebar.

### Fixed

* Console data table fetching worker threads now properly close their sequelize connections.
* Display issue with metadata titles.
* Links on edit pages no longer cause the page to scroll to the top.

***

## 3.4.0

### Added

* User Color Preference in settings.
* Widgets and Oauth for canvas and azure.
* My-Canvas.
* MyApps widget.
* tickets widget.
* My Schedule widget.
* My recent files widget.
* Canvas courses widget.
* Canvas todos widget.
* Suggested apps.

### Removed

* Sign in Sign out button from the left side bar - this functionality has been slowly migrated to the top-right & user-menu.

### Changed

### Fixed

* Issue with adding groups for restrict access.

***

## 3.3.0

### Added

* Servers to Software pages.
* Link to Home page in left sidebar.
* Pin icon to news posts that are Pinned.
* Ability to filter software by OS and their booleans on the software library page.

### Removed

### Changed

* Locations page is now Locations and Servers.
* Covid 19 Form to support faculty and staff requests rather than just students.

### Fixed

* Hamburger Menu icon was not toggling to an "X" when it was open.
* When logging in, users are now correctly redirected back to the page they were on when they attempted to sign in.
* Display issues with checklists.
* Issue when reordering featured content.

***

## 3.2.3

### Added

### Removed

### Changed

* Covid 19 Form automatic classification and priority setting.
* Covid 19 Form requires authentication.

### Fixed

***

## 3.2.2

### Added

### Removed

### Changed

* Covid 19 Form to support many students.

### Fixed

***

## 3.2.1

### Added

### Removed

### Changed

### Fixed

* Some issues with permissions handling.

***

## 3.2.0

### Added

* Covid 19 Building Access Form.

### Removed

### Changed

* Branding to Hub.
* From user menu to user sidebar menu.

### Fixed

***

## 3.1.0

### Added

* Geo field and Short Description field to editor for buildings.
* Order to featured content items.
* Ability to close resolved tickets, and reopen resolved tickets.
* Relationships for News->Article and Article->Article.
* Table and Checklist to Article.

### Removed

### Changed

* Permissions checks for the console table data API has been moved to a collection of worker threads to avoid blocking the main V8 JS process event loop.
* Updated @editorjs/table dependency to fix issue with table initialization size.
* Updated size of cherwellTokenCache for encrypted cherwell token storage per chagnes in Cherwell 10 release.

### Fixed

* Issue with myApps console page.
* Issue that would prevent saving existing locations.
* Issue with cybersecurity news rss feed.
* Issue with saving already existing metadata items (actions/audiences/tags/aliases).
* Email Actions now correctly add the mailto: part of the link automatically.
* Tickets are now set back to Assigned status when users post journal updates from the portal.
* Issue with saving featured content items.
* Issue with saving apps.

***

## 3.0.0

### Added

* **[Major Change]** Permissions Groups.
* Ability to restrict access to only associated Permissions Groups.
* "My Recently Edited" in the console.
* Groups are now copied along with news and spreads -> users who copied it are granted a 1-time use token to remove groups from the newly copied item.
* Apps are now in the search index.
* Inline Code to Paragraph Tool in Articles.
* Can now convert between the header tool and paragraph/list tool.
* WPI Theme.
* Article relationship to locaitons.

### Removed

### Changed

* Permission levels from Read-Create-Update-Delete to Read-Create-Author-Publish-Delete.
* Users that had "Update" permissions now have "publish" permissions.
* Permissions to phases are now restricted such that Author permissions are required to save things with the state "Draft" and "Review" and Publish permissions are required to save things with a state of "Publish" and "Retire".

### Fixed

* Issue with RSS date formatting that would cause RSS to fail to load.
* Issue with hours page (sometimes was showing hours for tomorrow instead of today).
* Scrolling behavior when opening modals in the console.
* Empty "About" sections no longer show up on software pages.
* Issue when edition hours in Chrome.

***

## 2.5.1

### Added

### Removed

### Changed

### Fixed

* Location hours table was showing the time for the current day.

***

## 2.5.0

### Added

* PWAs in standalone mode (installed WApp) now have a back button.
* Devices capable of using the navigator share API now use native device sharing (ex: on iOS Safari, the share button on articles, news, etc. will prompt you for airdrop/copy link/message/etc.).
* Ability to CRUD packages.
* Facebook OpenGraph metadata.
* Twitter Card metadata.
* Browser compatibility checking.
* Location fields for hasWacomTouchscreen, hasHDMILaptopCable, hasUSBCLaptopCable, and hasBlurayPlayer.
* Ability to duplicate software items.
* 404 page is now super smart and suggests things you might have been looking for.

### Removed

### Changed

* Special hours table in console no longer has a limit on the number of rows displayed (was 10, now infinity).
* Short description field no longer shows up when it is blank.
* External links now open in a new window when running the installed PWA (rather than trying to open them in the PWA itself).
* Hours table now shows today + 6 days instead of just "current week".
* Phrasing on search replica sets from "featured" to "relevance" to be a more fitting description.

### Fixed

* Console hours inconsistent on Chrome & Edge (needed seconds in time input value).
* Client side javascript for editing servers wasn't transpiling correctly.
* Portal communications on tickets would fail to load on closed tickets.
* Some issues with print CSS.
* Stability of List tool in content-editor.

***

## 2.4.0

### Added

* Greetings in 48 different languages.
* ServerPhase - draft, review, publish, retire lifecycle for Servers.
* Server - view, edit page, create new.
* Server to search index.
* Server to user history.
* Server - user access permissions.
* MyAssets API - get all of my assets.
* MyAssets API - get all of my assets where I'm the primary user.
* MyAssets API - get one asset with detailed info.
* Ability to copy Spreads in the console (spreadLayout, title, tags, audiences, aliases, column content, and column backgrounds).
* Asset view/page.
* Assets - Dynamic images with fallback icons in the database.
* Assets - ability to create tickets from an asset, automatically associating the asset in Cherwell.
* Actions are now searchable.

### Removed

* Service-Worker-Allowed http header from application layer - now handled strictly by web server.

### Changed

* Updated dependencies.
* Icon to open a new ticket from MyITS Dashboard from a question mark to a plus symbol.
* Legacy itswebhost01 static files moved to new itscdn server (dedicated to serving large binary files for the WebApp).

### Fixed

* Creating blank tables would cause an error.
* Creating new entities (article, news, etc.) would ask you if you want to leave the page when you save them for the first time - this behaviour has been changed.
* News Cards were displaying times in the wrong timezone (4 hrs behind the database).
* Content Type on image downloads was not properly being set - this would cause SVGs to fail to load.
* Bug when creating new featured content items from the console.
* Bug when users had light theme preference and dark theme system preference on buildings page (failed to load map tiles).

***

## 2.3.3

### Added

* RSS feed button to news page.

### Removed

### Changed

### Fixed

* RSS feed data format.

***

## 2.3.2

### Added

* Title attribute to actions across all pages (actions with long titles may overflow their container, but now hovering will allow you to see the full title of the action).

### Removed

### Changed

* SVG Present on Twelve Days of ITS widget.

### Fixed

* Twelve Days of ITS widget on mobile when logged out did not dispaly correctly.
* Twelve days of ITS widget link was missing text for screen readers.
* Relating articles to MyApps sometimes would fail to save.

***

## 2.3.1

### Added

* Twelve Days of ITS widget and tracking for the campaign of the WebApp.
* EditorJS - Note boxes to articles.
* EditorJS - Code blocks to articles.
* Experimental Features - Winter Wonderland.
* Experimental Features - Sarcasm.

### Removed

### Changed

* Nightly refresh of search index now only happens in production.
* Policies and procedures link in footer now opens in current tab instead of new tab.

### Fixed

* Most Installed Apps on console dashboard data was inaccurate.
* Some unpublished related items could potentially populate on pages.
* Note boxes were difficult to read on dark theme.

***

## 2.3.0

### Added

* Spreads - a new way to create dynamic content.
* Preview Links for Spreads.
* Sitemap for Spreads.
* Sitemap XML for Spreads.
* Search Index for Spreads.
* Spreads to User View History (/Me/History).
* When navigating away from an edit page in the console, users are now prompted to make sure they want to leave (changes may not be saved).
* Editorjs - Inline Code styles.
* Editorjs - Bold, Italics, Inline Code for the List tool.
* Editorjs - Toggle to and from List tool (paragraph -> list, list -> paragraph ...).
* Editorjs - Styles for changing between ordered and unordered list at the first level.
* Editorjs - Code Blocks.
* Editorjs - Embed Links - copy and paste a youtube.com link into a paragraph block and it will automatically embed the video to the page.
* Editorjs - Note boxes.
* Editorjs - Button Links for the spread layout.
* Editorjs - Table - Note that the first row in the table will be considered the "header" of the table.
* Editorjs - Checklist.
* Editorjs - Quote.

### Removed

### Changed

* Increased size of Location Room Notes field in the database to support larger amounts of data and images.
* Text on location cards on building page now only wrap to 2 lines.
* "My App" cards no longer use headers (skipped heading level on some pages).
* UX for adding comments to tickets.

### Fixed

* News Preview Links were failing to load header images at the top of the page.
* Saving Locations would sometimes strip data from the Room Notes field.
* Issue that would sometimes fail to load search items into index.
* Cybernews RSS feed no longer shows unpublished content.
* Building page was not showing the maps on dark theme.

***

## 2.2.0

### Added

* Create and Edit Actions in the console.
* Create and Edit Audiences in the console.
* Create and Edit Aliases in the console.
* Create and Edit Glossary Items in the console.
* Create and Edit Tags in the console.
* Duplicate News Posts (in order to use an existing News Post as a template for a new News Post).
* App Marketplace to search index.
* More of the "My ITS" pages to the search index.
* `ownedByPerson` to NetOps API endpoints.
* `hasProblem` to NetOps API endpoints.
* `problemID` to NetOps API endpoints.
* `problemTitle` to NetOps API endpoints.
* Styles for Figure Captions & Images with borders and backgrounds.
* Link on edit pages to go to the actual view for an item (e.g. when editing an article, click "Go to Article").
* Require Authorization option when editing articles.
* Articles now have large header images at the top of the page.
* News Posts now have large header images at the top of the page.

### Removed

* Articles that require auth no longer show up in the sitemap xml.
* /Utilities no longer shows up in the sitemap xml.

### Changed

* New service workers now force install themselves to replace the old service worker. This ensures users get the most up-to-date site resources with each future release.
* Hearts on `/app/{{id}}` were displaying as emojis on iOS, they are now unicode character hearts.
* Tables in the console now save their state, so when returning to the page they remain on the same page with the applied filters.
* Updated editorjs core and image library.
* Brightened color of links on All Software page for users on dark theme, made them black for high contrast.
* Blue color now shows as black on high contrast theme.
* Nav now dynamically closes on mobile devices when navigating.
* Service Desk and Call Center Hours.
* Show on home page on new News Posts defaults to true now.
* App Marketplace Apps now sort alphabetically.
* Color of footer links.

### Fixed

* Some issues with adding actions, services, components, and software items to articles and news - this feature should be more robust now.
* Creating new articles: failed to redirect to view your newly created article.
* Actions on some pages were displaying `&amp;` instead of `&` (html escape issue).
* Some news fields were displaying `&amp;` instead of `&` (html escape issue).
* Open/Closed indicator on /Help page was incorrectly calculating the current date and time (offset by 4 hours).
* Save button was going off the page when changing the width of the window / expanding the side navbar.
* Available Apps on /Me/My-Apps page were not being filtered when searching.

***

## 2.1.0

### Added

* Location -> Room # to search index
* New Feature: MyApps

#### API Endpoints for NetOps
  * `GET /api/v1/cherwell/ticket/get/netops?team=<assigned_team>`
  * `GET /api/v1/cherwell/task/get/netops?team=<assigned_team>`

*Note 1:* `assigned_team` is one of ["Network Operations", "Network Operations Staff", "Telecommunications", "Facilities and Safety", "all"]

*Note 2:* Expects request header `"Authorization": "Bearer <token>"`

### Removed

### Changed

* News Console now defaults to sorting by most recently created.

### Fixed

* Bug that was preventing the Admin/Edit box in the sidebar from showing up for users who should see it.
* 4 or more Featured Content items did not display correctly.
* Linking a Service from an Article sometimes failed to save the article.

***

## 2.0.0

### Added

### Removed

### Changed

* Everything.

### Fixed