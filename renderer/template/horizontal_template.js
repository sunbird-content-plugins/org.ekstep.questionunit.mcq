var MCQController = MCQController || {};
MCQController.getHorizontalTemplate = function () {
  return "<div class='mcq-horizontal-container'><div class='q-container'>\
  <div class='question'>\
    <div class='q-media'>\
    <% if ( question.data.question.image){ %> \
      <div class='q-image'>\
        <img src=<%=MCQController.pluginInstance.getAssetUrl( question.data.question.image) %> /> \
      </div>\
    <% } %> \
    <% if (question.data.question.image && question.data.question.audio){ %> \
      <div class='q-audio'>\
        <img src='<%=MCQController.pluginInstance.getDefaultAsset('audio-icon.png') %>' onclick=MCQController.pluginInstance.playAudio('<%= question.data.question.audio %>') />\
      </div>\
    <% } %> \
    </div>\
    <% if (question.data.question.audio && !question.data.question.image){ %> \
      <div class='q-audio-only'>\
        <img src='<%=MCQController.pluginInstance.getDefaultAsset('audio-icon.png') %>' onclick=MCQController.pluginInstance.playAudio('<%= question.data.question.audio %>') />\
      </div>\
    <% } %> \
    <div class='q-text'>\
      <div class='q-text-content multiline-ellipsis three-line'><%= question.data.question.text %></div>\
    </div>\
    <div class='expand'>\
      <img src='<%=MCQController.pluginInstance.getDefaultAsset('expand-icon.png') %>' onclick=MCQController.openPopup('question') />\
    </div>\
  </div>\
</div>\
<hr style='clear:both;' />\
<div class='a-container'>\
  <div class='answers'>\
  <% _.each(question.data.options, function(val,key,index) { %> \
    <div class='option' id='active<%= key %>' onclick=MCQController.pluginInstance.logTelemetryInteract(event);MCQController.pluginInstance.selectedvalue(event,<%= key %>)>\
      <input type='checkbox' name='checkbox' style='display: none;'/>\
      <div class='a-media'>\
        <% if ( val.image){ %> \
          <div class='a-image'>\
            <img src=<%=MCQController.pluginInstance.getAssetUrl(val.image)%> style='height: 54px;'/>\
          </div>\
        <%}%>\
        <% if (val.image && val.audio){ %> \
          <div class='a-audio'>\
            <img src='<%=MCQController.pluginInstance.getDefaultAsset('audio-icon.png') %>' onclick=MCQController.pluginInstance.playAudio('<%= val.audio %>') />\
          </div>\
        <%}%>\
      </div>\
      <% if (val.audio && !val.image){ %> \
        <div class='a-audio-only'>\
          <img src='<%=MCQController.pluginInstance.getDefaultAsset('audio-icon.png') %>' onclick=MCQController.pluginInstance.playAudio('<%= val.audio %>') />\
        </div>\
      <%}%>\
      <div class='a-text'>\
        <div class='a-text-content multiline-ellipsis two-line'><%=val.text%></div>\
      </div>\
      <div class='expand'>\
        <img src='<%=MCQController.pluginInstance.getDefaultAsset('expand-icon.png') %>' onclick=MCQController.openPopup(<%= key %>) />\
      </div>\
    </div>\
    <%});%>\
  </div>\
</div></div>\
";
};