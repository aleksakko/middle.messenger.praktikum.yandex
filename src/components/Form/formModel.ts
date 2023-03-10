const tagsModel = `{{#if title}}<{{{titletag}}}>{{title}}</{{{titletag}}}>{{/if}}
{{#with this}}
  {{#each this}}  
    {{#if (startsWith @key "input")}}
      <div class="form-cont__field">
        {{{this}}}
        <label for={{get @root 'tmpl' 'labelfor' @key}}>{{get @root 'tmpl' 'label' @key}}</label>
      </div>
    {{/if}}
    {{#if (startsWith @key "alink")}}
      {{{this}}}
    {{/if}}
    {{#if (startsWith @key "button")}}
      {{{this}}}
    {{/if}}   
    {{#if (startsWith @key "ava")}}
      <div class="form-cont__field avatar">
        {{#if (startsWith @key "avaChange")}}
          {{{this}}}
        {{/if}}
        {{#if (startsWith @key "avaStatic")}}
          {{{this}}}
        {{/if}}
      </div>
    {{/if}}
  {{/each}}
{{/with}}`;

export default tagsModel;
