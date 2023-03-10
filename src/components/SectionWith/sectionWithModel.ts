const tagsModel = `{{#if title}}<{{{titletag}}}>{{title}}</{{{titletag}}}>{{/if}}
{{#if modalAvatar}}{{{modalAva}}}{{/if}}

{{#with this}}
  {{#each this}}
    {{#if (startsWith @key "span")}}
      <div class={{../childClassName}}>
        <span>{{get @root 'tmpl' 'labelSpanUp' @key}}</span>
        <span>{{get @root 'tmpl' 'labelSpanDown' @key}}</span>
      </div>
    {{/if}}
    {{#if (startsWith @key "alink")}}
      {{{this}}}
    {{/if}}
    {{#if (startsWith @key "ava")}}
      <div class="profile-cont__field avatar">        
          {{{this}}}
      </div>
    {{/if}}
    {{#if (startsWith @key "texta")}}
          {{{this}}}
    {{/if}}
    {{#if (startsWith @key "button")}}
          {{{this}}}
    {{/if}}
  {{/each}}
{{/with}}`;

export default tagsModel;
