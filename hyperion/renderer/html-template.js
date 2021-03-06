// @flow
import fs from 'fs';
import path from 'path';
import { html } from 'common-tags';
import serialize from 'serialize-javascript';

// Match main.asdf123.js in production mode or bundle.js in dev mode
const mainBundleRegex = new RegExp(
  `${process.env.NODE_ENV === 'production' ? 'main' : 'bundle'}\.(?:.*\.)?js$`
);

let bundles;
try {
  bundles = fs.readdirSync(path.join(__dirname, '../../build/static/js'));
} catch (err) {
  throw new Error(
    'It looks like you didn\'t run "yarn run dev:web" or "yarn run build:web" before starting hyperion. Please wait until either of them completes before starting hyperion.'
  );
}

// Get the main bundle filename
const mainBundle = bundles.find(bundle => mainBundleRegex.test(bundle));
if (!mainBundle) {
  throw new Error(
    'It looks like you didn\'t run "yarn run dev:web" or "yarn run build:web" before starting hyperion. Please wait until either of them completes before starting hyperion.'
  );
}

export const createScriptTag = ({ src }: { src: string }) =>
  `<script defer="defer" src="${src}"></script>`;

export const getHeader = ({ metaTags }: { metaTags: string }) => {
  return html`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <link rel="mask-icon" href="/img/pinned-tab.svg" color="#171A21">
          <meta name="theme-color" content="#171A21">
          <link rel="manifest" href="/manifest.json">
          <meta name="og:type" content="website">
          <meta name="og:site_name" content="Spectrum.chat">
          <meta name="twitter:card" content="summary">
          <meta name="twitter:site" content="@withspectrum">
          <meta name="twitter:image:alt" content="Where communities are built">
          <link rel="apple-touch-icon-precomposed" sizes="57x57" href="/img/apple-icon-57x57-precomposed.png" />
          <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/img/apple-icon-72x72-precomposed.png" />
          <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/img/apple-icon-114x114-precomposed.png" />
          <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/img/apple-icon-144x144-precomposed.png" />
          ${metaTags}
          <script>
              !function(e,a,t,n,g,c,o){e.GoogleAnalyticsObject=g,e.ga=e.ga||function(){(e.ga.q=e.ga.q||[]).push(arguments)},e.ga.l=1*new Date,c=a.createElement(t),o=a.getElementsByTagName(t)[0],c.defer=1,c.src="https://www.google-analytics.com/analytics.js",o.parentNode.insertBefore(c,o)}(window,document,"script",0,"ga"),ga("create","UA-92673909-1","auto"),ga("send","pageview"),ga('set', 'anonymizeIp', true)
          </script>
        </head>
        <body>
          <div id="root">`;
};

export const getFooter = ({
  state,
  data,
  bundles,
}: {
  state: Object,
  data: Object,
  bundles: Array<string>,
}) => {
  return html`</div>
      <script defer="defer" src="https://cdn.ravenjs.com/3.14.0/raven.min.js" crossorigin="anonymous"></script>
      <script defer="defer" src="/install-raven.js"></script>
      <script>window.__SERVER_STATE__=${serialize(state)}</script>
      <script>window.__DATA__=${serialize(data)}</script>
      <script defer="defer" type="text/javascript" src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
      <script type="text/javascript" src="/static/js/bootstrap.js"></script>
      ${bundles.map(src => createScriptTag({ src }))}
      ${createScriptTag({ src: `/static/js/${mainBundle}` })}
    </body>
    </html>
  `;
};
