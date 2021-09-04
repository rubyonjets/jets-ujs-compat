# @rubyonjets/ujs-compat

UJS compat library for Ruby on Jets and API Gateway.

## Overview

The [@rails/ujs](https://github.com/rails/rails/tree/main/actionview/app/assets/javascripts) package adds unobtrusive JavaScript scripting support for Rails.  This is typically done with:

    yarn add @rails/ujs

Call rails ujs code:

app/javascript/packs/application.js

```javascript
import Rails from "@rails/ujs"
Rails.start()
```

### How Rails UJS Works

1. The `@rails/ujs` package registers click handlers to links with the `data-delete` attribute. Example: `<a data-confirm="Are you sure?" rel="nofollow" data-method="delete" href="/posts/123">Destroy</a>`
2. When the link is clicked, `@rails/ujs` creates a hidden form and submits the request as a `POST` request with a hidden field `_method=delete`.
3. The [Rack::MethodOverride](https://github.com/rack/rack/blob/master/lib/rack/method_override.rb) middleware is used to then adjust `POST` to `DELETE` request appropriately.


Essentially, a DELETE http request is mimiced using a POST http request. It all happens transparently, so developers don't really notice the magic happening behind the scenes.

## The Issue

Unfortunately API Gateway REST APIs require actual DELETE requests to the resource, not mimiced POST requests. Example:

    DELETE /posts/123

Sending a `POST /posts/123` with a `_method=delete` will not work with API Gateway because the `POST /posts/123` route points to the `posts#update` method API Gateway.

## The Fix

To fix the issue, this javascript library adds click handlers that intercept `@rails/ujs` handlers and sends an AJAX DELETE request correctly.

## Usage

    yarn add @rubyonjets/ujs-compat

And then add the Jets ujs-compat code below the Rails ujs code.

app/javascript/packs/application.js

```javascript
import Rails from "@rails/ujs"
Rails.start()
import Jets from "@rubyonjets/ujs-compat"
Jets.start()
```

## Thoughts and Considerations

* Considered putting `POST /posts/123` to the `posts#delete` action instead of `posts#update`. But that feels like unexpected behavior.
* Considered adding logic at the lambda handlers processing logic to convert `posts#update` actions with `_method=delete` to call `posts#delete`. This will make the logic closer to what `Rack::MethodOverride` does but again feels a little bit confusing.
* So went with javascript library to handle things earlier. An actual DELETE request is sent via AJAX to API Gateway.
* Open to suggestions and improvements.