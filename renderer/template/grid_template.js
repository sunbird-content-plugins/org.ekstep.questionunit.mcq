var MCQController = MCQController || {};

MCQController.gridConfig = {
  optIndices: []
}

MCQController.initGridConfig = function (options) {
  MCQController.gridConfig.optIndices = _.range(options.length);
}

MCQController.getRowCount = function (optsCount) {
  return optsCount > 4 ? 2 : 1
}

MCQController.getOptionTemplate = function (option) {
  var optTemplate = '\
  <div class="mcq-grid-option-outer">\
    <% if (option.audio){ %> \
      <div class="mcq-grid-option-audio">\
        <img src="<%= MCQController.pluginInstance.getDefaultAsset("audio-icon2.png") %>"  onclick=MCQController.pluginInstance.playAudio("<%= option.audio %>") />\
      </div>\
    <% } %> \
    <div class="mcq-grid-option">\
    <% if (option.image){ %> \
      <div class="mcq-grid-option-image" style="background-image:url(<%= MCQController.pluginInstance.getAssetUrl(option.image) %>)">\
        <img src="<%= MCQController.pluginInstance.getAssetUrl(option.image) %>" style="display:none" />\
      </div>\
    <% } %> \
    <% if (option.text){ %> \
      <div class="mcq-grid-option-text">\
        <div><%= option.text %></div>\
      </div>\
    <% } %> \
    </div>\
  </div>';
  return _.template(optTemplate)({ "option": option });
}

MCQController.getOptionsForRow = function (optIndices, i, options) {
  var rowOpts = [], opts = "";
  if (i == 0)
    rowOpts = optIndices.length > 4 ? _.take(optIndices, Math.round((optIndices.length * 1.0) / 2))
      : _.take(optIndices, optIndices.length);
  else {
    var remainingOptions = optIndices.length - Math.round((optIndices.length * 1.0) / 2);
    rowOpts = _.last(optIndices, remainingOptions);
  }
  _.each(rowOpts, function (o, i) {
    opts += MCQController.getOptionTemplate(options[o]);
  });
  return opts;
}

MCQController.getOptionRows = function (optIndices, options) {
  var rowTemplate = '';
  var r = 0; maxRow = MCQController.getRowCount(optIndices.length);
  while (r < maxRow) {
    rowTemplate += '<div class="mcq-grid-options-row">\
			<div class="mcq-grid-option-wrapper">'+
      MCQController.getOptionsForRow(optIndices, r, options)
      + '</div></div>';
    r++;
  }
  return rowTemplate;
}

MCQController.getGridOptionsTemplate = function (options) {
  MCQController.initGridConfig(options);
  return MCQController.getOptionRows(MCQController.gridConfig.optIndices, options);
}

MCQController.getGridTemplate = function (question) {
  var template = '\
  <div class="mcq-question-container-grid">\
    <div class="mcq-grid-question-container question-content-container">' +
    org.ekstep.questionunit.questionComponent.generateQuestionComponent() +
    '</div>\
    <div class="mcq-grid-option-container"><div>' +
    MCQController.getGridOptionsTemplate(question.data.options) +
    '</div></div>\
  </div>';
  return template;
}

MCQController.getGridQuestionTemplate = function (question) {
  return "<div class='mcq-grid-option-container'>\
  </div>";
}

MCQController.getGridTemplate_old = function () {
  return "<div class='qc-grid-option-container'>\
        <% _.each(question.data.topOptions, function(val,key,index) { %> \
<div class='qc-grid-option-outer-value'> \
<div class='qc-grid-option-value'> \
  <div class='qc-grid-option-text-outer' id=<%=key%>  onclick=MCQController.pluginInstance.logTelemetryInteract(event);MCQController.checkOptioninGrid(<%=val.keyIndex%>);MCQController.pluginInstance.selectedvalue(event,<%=val.keyIndex%>) id='option'> \
  <div class='mcq-selected-option'></div> \
      <div class='qc-grid-option-text'>\
              <% if(val.option.audio.length > 0 && val.option.image.length == 0){%> \
          <div class='qc-opt'>\
                   <img class='qc-vertical-audio-with-image' onclick=MCQController.pluginInstance.playAudio('<%= val.option.audio %>')  src=<%=MCQController.pluginInstance.getDefaultAsset(MCQController.pluginInstance._defaultAudioIcon) %>>\
          </div>\
                <%}%> \
                  <% if(val.option.image.length>0){%> \
         <div class='qc-opt'>\
                  <img class='qc-grid-option-image' onclick='MCQController.showImageModel(event)' src=<%=MCQController.pluginInstance.getAssetUrl( val.option.image) %>>\
         </div>\
                   <%}%> \
                 <% if(val.option.image.length == 0 && val.option.audio.length == 0){%> \
         <div class='qc-opt'>\
                 <%=val.option.text%> \
        </div>\
                <%}%> \
      </div>\
            <div class='qc-option-grid-checkbox'> \
                                <div class='grid-check-space'> \
                                    <input type='radio' name='radio' value='pass' class='qc-option-input-checkbox'> \
                                </div> \
                 <% if(val.option.audio.length>0 && val.option.image.length > 0){%> \
               <div>\
                      <img class='qc-grid-audio-with-image' onclick=MCQController.pluginInstance.playAudio('<%= val.option.audio %>')  src=<%=MCQController.pluginInstance.getDefaultAsset(MCQController.pluginInstance._defaultAudioIcon) %>>\
               </div>\
                <%}%> \
            </div>\
  </div> \
  </div> \
  </div> \
            <% }); %> \
</div> \
<div class='qc-grid-option-container'> \
<% if(question.data.bottomOptions.length != 0){%>\
  <div class='qc-grid-option-container'>\
  <% _.each(question.data.bottomOptions, function(val,key,index) { %> \
<div class='qc-grid-option-outer-value'> \
<div class='qc-grid-option-value'> \
  <div class='qc-grid-option-text-outer mcq-option-value' id=<%=key%> onclick=MCQController.pluginInstance.logTelemetryInteract(event);MCQController.checkOptioninGrid(<%=val.keyIndex%>);MCQController.pluginInstance.selectedvalue(event,<%=val.keyIndex%>) id='option'> \
  <div class='mcq-selected-option'></div> \
      <div class='qc-grid-option-text'>\
              <% if(val.option.audio.length > 0 && val.option.image.length == 0){%> \
          <div class='qc-opt'>\
                   <img class='qc-vertical-audio-with-image' onclick=MCQController.pluginInstance.playAudio('<%= val.option.audio %>')  src=<%=MCQController.pluginInstance.getDefaultAsset(MCQController.pluginInstance._defaultAudioIcon) %>>\
          </div>\
                <%}%> \
                  <% if(val.option.image.length>0){%> \
         <div class='qc-opt'>\
                  <img class='qc-grid-option-image' onclick='MCQController.showImageModel(event)' src=<%=MCQController.pluginInstance.getAssetUrl( val.option.image) %>>\
         </div>\
                   <%}%> \
                 <% if(val.option.image.length == 0 && val.option.audio.length == 0){%> \
         <div class='qc-opt'>\
                 <%=val.option.text%> \
        </div>\
                <%}%> \
      </div>\
            <div class='qc-option-grid-checkbox'> \
                                <div class='grid-check-space'> \
                                    <input type='radio' name='radio' value='pass' class='qc-option-input-checkbox'> \
                                </div> \
                 <% if(val.option.audio.length>0 && val.option.image.length > 0){%> \
               <div>\
                      <img class='qc-grid-audio-with-image' onclick=MCQController.pluginInstance.playAudio('<%= val.option.audio %>')  src=<%=MCQController.pluginInstance.getDefaultAsset(MCQController.pluginInstance._defaultAudioIcon) %>>\
               </div>\
                <%}%> \
            </div>\
  </div> \
  </div> \
  </div> \
            <% }); %> \
</div> \
<%}%>\
      </div>";
};

MCQController.checkOptioninGrid = function (index) {
  $(".mcq-selected-option").removeClass("mcq-option-checked");
  $('.mcq-selected-option').eq(index).addClass('mcq-option-checked');
};