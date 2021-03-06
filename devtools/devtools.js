import { escapeAttribute, className } from './utils.js';
import renderHtml from './output-html.js';
import renderText from './output-text.js';

function htmlToElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

const Row = ({ status, statusText, url }) => htmlToElement(`
  <tr>
    <td class="status ${className(status)}" title="${statusText}">
      <span class="status-bubble">${status}</span>
    </td>
    <td class="url" title="${escapeAttribute(url)}">
      ${url}
    </td>
    <td class="buttons">
      <button class="copy">
        Copy text
      </button>
      <button class="export">
        Export
      </button>
    </td>
  </tr>
`);

browser.devtools.panels.create(
  "Savior",
  "/devtools/icons/icon-24.png",
  "/devtools/panel/panel.html"
).then(newPanel => {
  function panelHandler({ document }) {
    document.body.className = browser.devtools.panels.themeName;
    const tbody = document.querySelector('tbody');
    document.querySelector('#clear').addEventListener(
      'click',
      () => document.querySelector('tbody').innerHTML = '',
    );

    browser.devtools.network.onRequestFinished.addListener(request => {
      const { url } = request.request;
      const { status, statusText } = request.response;

      // Cant use contentType from await getContent because chrome does not
      // support it. Fetch contentType from headers instead.
      let contentType;
      request.response.headers.some(({ name, value }) => {
        if (name.toLowerCase() !== 'content-type') return false;
        contentType = value;
        return true;
      });

      // TODO a lot of responses come through with status 0 and missing data.
      // Filter them out until we can figure out what is going on
      // Probably caused by https://bugzilla.mozilla.org/show_bug.cgi?id=1472653
      if (!status) return;

      const row = Row({ url, status, statusText });

      row
        .querySelector('.copy')
        .addEventListener('click', () => {
          request.getContent(body => {
            browser.runtime.sendMessage({
              type: 'copyText',
              data: renderText({
                ...request,
                contentType,
                body,
              }),
            });
          });
        })

      row
        .querySelector('.export')
        .addEventListener('click', () => {
          request.getContent(body  => {
            browser.runtime.sendMessage({
              type: 'exportHtml',
              data: renderHtml({
                ...request,
                contentType,
                body,
              }),
            });
          });
        })

      tbody.appendChild(row);
    });
  };

  newPanel.onShown.addListener(panelHandler);
  newPanel.onHidden.removeListener(panelHandler);
});
