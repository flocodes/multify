# TODO

## Fixes

* Remove console.log statements before release

## New features

* Notify user when max seeds reached
    * Using toasts from bootstrap is too manual
        * Positioning not consistent
        * Gets shown behind content on emulated phone
* Notify user if no recommendations could be retrieved from Spotify
* Improve playlist generation settings
    * Validate min/max/target inputs
    * Min/max two-value range input (like this: 0 --x====x--1 ) for min/max specification of features
    * Animations for filters
* Improve accessibility
* Transitions
    * Issue: Animating list items makes content below jump.

## Maybe add

* Add genre seeds?
* Add user's top artists and tracks to suggestions? (scope!)
* Only show play buttons when there is an active Spotify session? Need to tell user that they can play tracks from the app.
* Find a more secure way of storing the Spotify token
    * sessionStorage not suited, because it is tab-specific