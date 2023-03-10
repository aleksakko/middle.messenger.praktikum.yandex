const tagsModel = `{{#if title}}<{{{titletag}}}>{{title}}</{{{titletag}}}>{{/if}}
{{{modal}}}
<ul>    
  {{#each arrNames}}
    {{{get @root this}}}
  {{/each}}
</ul>`;

export default tagsModel;
