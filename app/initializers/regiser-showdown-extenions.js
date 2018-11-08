import showdown from 'showdown';
import showdownSectionGroups from 'showdown-section-groups';

export function initialize() {
  showdown.subParser('ellipsis', function (text, options, globals) {
    text = globals.converter._dispatch('ellipsis.before', text, options, globals);
    text = globals.converter._dispatch('ellipsis.after', text, options, globals);
    return text;
  });

  showdown.extension('showdown-section-groups', showdownSectionGroups);

  showdown.subParser('githubCodeBlocks', function (text, options, globals) {
    'use strict';

    // early exit if option is not enabled
    if (!options.ghCodeBlocks) {
      return text;
    }

    text = globals.converter._dispatch('githubCodeBlocks.before', text, options, globals);

    text += '¨0';

    text = text.replace(/(?:^|\n)```(.*)\n([\s\S]*?)\n```/g, function (wholeMatch, languageBlock, codeblock) {
      var end = (options.omitExtraWLInCodeBlocks) ? '' : '\n';

      // First parse the github code block
      codeblock = showdown.subParser('encodeCode')(codeblock, options, globals);
      codeblock = showdown.subParser('detab')(codeblock, options, globals);
      codeblock = codeblock.replace(/^\n+/g, ''); // trim leading newlines
      codeblock = codeblock.replace(/\n+$/g, ''); // trim trailing whitespace

      var match = languageBlock.match(/(\w+)(\s+{(.*)})?/);
      var languageString = '';
      var attributeString = '';

      if(match && match[1]) {
        languageString = ' class="' + match[1] + ' language-' + match[1] + '"';
      }

      if (match && match[3]) {
        attributeString = match[3];
      }

      codeblock = '<pre><code' + languageString + attributeString + '>' + codeblock + end + '</code></pre>';

      codeblock = showdown.subParser('hashBlock')(codeblock, options, globals);

      // Since GHCodeblocks can be false positives, we need to
      // store the primitive text and the parsed text in a global var,
      // and then return a token
      return '\n\n¨G' + (globals.ghCodeBlocks.push({text: wholeMatch, codeblock: codeblock}) - 1) + 'G\n\n';
    });

    // attacklab: strip sentinel
    text = text.replace(/¨0/, '');

    return globals.converter._dispatch('githubCodeBlocks.after', text, options, globals);
  });
}

export default {
  name: 'register-showdown-extensions',
  initialize
};
