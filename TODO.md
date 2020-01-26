# TODO

## Fixes

## New features

* Notify user when max seeds reached -> initial version done
    * Make less jumpy, fade out suggestions, fade in "max seeds reached" text
* Add default artist and track images
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
* Add tracks from generated playlist to seeds by clicking on them? Need to re-add play button to each track to allow playing individual tracks.
* Add user's top artists and tracks to suggestions? (scope!)
* Only show play buttons when there is an active Spotify session? Need to tell user that they can play tracks from the app.
* Find a more secure way of storing the Spotify token
    * sessionStorage not suited, because it is tab-specific