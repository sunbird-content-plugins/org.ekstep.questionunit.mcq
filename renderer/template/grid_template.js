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

MCQController.onGridOptionSelected = function (event, index) {
  console.log('Option ' + index + ' selected.');
  // clear all selected options and select this option
  $('.mcq-grid-option').removeClass('selected');
  var optElt = $(event.target).closest('.mcq-grid-option');
  if (optElt) optElt.addClass('selected');
  MCQController.pluginInstance.onOptionSelected(event, index);
  if (MCQController.pluginInstance._question.data.options[index].audio)
    MCQController.pluginInstance.playAudio(MCQController.pluginInstance._question.data.options[index].audio);
}

MCQController.getOptionTemplate = function (option, index) {
  var optTemplate = '\
  <div class="mcq-grid-option-outer">\
    <% if (false && option.audio){ %> \
      <div class="mcq-grid-option-audio">\
        <img src="<%= MCQController.pluginInstance.getDefaultAsset("audio-icon2.png") %>"  onclick=MCQController.pluginInstance.playAudio("<%= option.audio %>") />\
      </div>\
    <% } %> \
    <div class="mcq-grid-option" onclick="MCQController.onGridOptionSelected(event, <%= index %>)">\
    <% if (option.image){ %> \
      <div class="mcq-grid-option-image" style="background-image:url(<%= MCQController.pluginInstance.getAssetUrl(option.image) %>)">\
        <img src="<%= MCQController.pluginInstance.getAssetUrl(option.image) %>" style="display:none" />\
      </div>\
    <% } %> \
    <div class="selected-icon"><img src="<%= MCQController.pluginInstance.getDefaultAsset("tick_icon.png") %>"></div>\
    <% if (option.text){ %> \
      <div class="mcq-grid-option-text">\
        <div><%= option.text %></div>\
      </div>\
    <% } %> \
    </div>\
  </div>';
  return _.template(optTemplate)({ "option": option, "index": index });
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
    opts += MCQController.getOptionTemplate(options[o], o);
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
  var template =
    org.ekstep.questionunit.backgroundComponent.getBackgroundGraphics() +
    '<div class="mcq-question-container-grid plugin-content-container">\
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
}

MCQController.checkOptioninGrid = function (index) {
  $(".mcq-selected-option").removeClass("mcq-option-checked");
  $('.mcq-selected-option').eq(index).addClass('mcq-option-checked');
};