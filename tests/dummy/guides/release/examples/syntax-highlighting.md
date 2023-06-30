This will just be a bunch of examples showing the different styles that are available.
You can do code blocks or `inline code in backticks`.

```bash
mkdir super-rentals
```

```javascript {data-filename=app/router.js}
import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
});

export default Router;
```

```javascript {data-filename="app/router.js" data-diff="+10"}
import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('about');
});

export default Router;
```

```handlebars {data-filename=app/templates/about.hbs}
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>About Super Rentals</h2>
  <p>
    The Super Rentals website is a delightful project created to explore Ember.
    By building a property rental site, we can simultaneously imagine traveling
    AND building Ember applications.
  </p>
</div>
```

```handlebars {data-filename="app/templates/application.hbs" data-diff="-1,-2,-3"}
{{!-- The following component displays Ember's default welcome message. --}}
<WelcomePage />
{{!-- Feel free to remove this! --}}

{{outlet}}

```

Just a little tip: you need to make sure that the code samples aren't the first or last things on the page
