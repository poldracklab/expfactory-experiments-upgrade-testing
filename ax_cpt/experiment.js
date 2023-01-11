var jp = 'dis global?'
/* ************************************ */
/* Define helper functions */
/* ************************************ */
function evalAttentionChecks() {
  var check_percent = 1
  if (run_attention_checks) {
    var attention_check_trials = jsPsych.data.getTrialsOfType('attention-check')
    var checks_passed = 0
    for (var i = 0; i < attention_check_trials.length; i++) {
      if (attention_check_trials[i].correct === true) {
        checks_passed += 1
      }
    }
    check_percent = checks_passed / attention_check_trials.length
  }
  return check_percent
}

var getChar = function() {
  return '<div class = centerbox><p class = AX_text>' + chars[Math.floor(Math.random() * 22)] +
    '</p></div>'
}

var getInstructFeedback = function() {
    return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
      '</p></div>'
  }
  /* ************************************ */
  /* Define experimental variables */
  /* ************************************ */
  // generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var possible_responses = [
  ["M key", "KeyM"],
  ["Z key", "KeyZ"]
]
var chars = 'BCDEFGHIJLMNOPQRSTUVWZ'
var trial_proportions = ["AX", "AX", "AX", "AX", "AX", "AX", "AX", "BX", "AY", "BY"]
/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
/*
var attention_check_block = {
  type: 'attention-check',
  data: {
    trial_id: "attention_check"
  },
  trial_duration: 180000,
  response_ends_trial: true,
  post_trial_gap: 200
}

var attention_node = {
  timeline: [attention_check_block],
  conditional_function: function() {
    return run_attention_checks
  }
}
*/

//Set up post task questionnaire
var post_task_block = {
  type: jsPsychSurveyText,
  data: {
      trial_id: "post task questions"
  },
  questions: [
    {
      prompt: '<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
      rows: 15,
      columns: 60,
    },
    {
      prompt: '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>',
      rows: 15,
      columns: 60,
   }
  ]
};

// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.65

// task specific variables
/* define static blocks */
var end_block = {
  type: jsPsychHtmlKeyboardResponse,
  trial_duration: 180000,
  data: {
    exp_id: "ax_cpt",
    trial_id: "end"
  },
  stimulus: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  choices: ['Enter'],
  post_trial_gap: 0
};

var feedback_instruct_text =
  'Welcome to the experiment. Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
  type: jsPsychHtmlKeyboardResponse,
  choices: ['Enter'],
  stimulus: getInstructFeedback,
  data: {
    trial_id: 'instruction'
  },
  post_trial_gap: 0,
  trial_duration: 180000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
  type: jsPsychInstructions,
  pages: [
    '<div class = centerbox><p class = block-text>In this task, on each trial you will see a letter presented for a short time, followed by the presentation of another letter. For instance you may see "A", which would then disappear to be replaced by "F".</p><p class = block-text>Your job is to respond by pressing an arrow key during the presentation of the <strong>second</strong> letter. If the first letter was an "A" <strong>AND</strong> the second letter was an "X", press the ' +
    possible_responses[0][0] + '. Otherwise press the ' + possible_responses[1][0] +
    '.</p></div>',
    '<div class = centerbox><p class = block-text>We will now start the experiment. Remember, press the left arrow key after you see "A" followed by an "X", and the down arrow key for all other combinations.</p></div>'
  ],
  allow_keys: false,
  data: {
    exp_id: "ax_cpt",
    trial_id: 'instruction'
  },
  show_clickable_nav: true,
  post_trial_gap: 01000
};

var instruction_node = {
  timeline: [feedback_instruct_block, instructions_block],
  /* This function defines stopping criteria */
  /* trial_type doesn't exist anymore?
  loop_function: function(data) {
    for (i = 0; i < data.length; i++) {
      if ((data[i].trial_type == 'poldrack-instructions') && (data[i].rt != -1)) {
        rt = data[i].rt
        sumInstructTime = sumInstructTime + rt
      }
    }
    if (sumInstructTime <= instructTimeThresh * 1000) {
      feedback_instruct_text =
        'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <strong>enter</strong> to continue.'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        'Done with instructions. Press <strong>enter</strong> to continue.'
      return false
    }
  }
  */
}

var rest_block = {
  type: jsPsychHtmlKeyboardResponse,
  trial_duration: 180000,
  data: {
    trial_id: "rest"
  },
  stimulus: '<div class = centerbox><p class = block-text>Take a break! Press any key to continue.</p></div>',
  post_trial_gap: 1000
};

var wait_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div class = centerbox><div class = AX_feedback>Trial over, get ready for the next one.</div></div>',
  is_html: true,
  choices: ["NO_KEYS"],
  data: {
    trial_id: "wait"
  },
  post_trial_gap: 500,
  stim_duration: 1000,
  trial_duration: 1000
}

/* define test block cues and probes*/
var A_cue = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div class = centerbox><div class = AX_text>A</div></div>',
  is_html: true,
  choices: ["NO_KEYS"],
  data: {
    trial_id: "cue",
    exp_stage: "test"
  },
  stim_duration: 300,
  trial_duration: 5200,
  response_ends_trial: false,
  post_trial_gap: 0
};

var other_cue = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: getChar,
  is_html: true,
  choices: ["NO_KEYS"],
  data: {
    trial_id: "cue",
    exp_stage: "test"
  },
  stim_duration: 300,
  trial_duration: 5200,
  response_ends_trial: false,
  post_trial_gap: 0
};

var X_probe = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div class = centerbox><div class = AX_text>X</div></div>',
  is_html: true,
  choices: [possible_responses[0][1], possible_responses[1][1]],
  data: {
    trial_id: "probe",
    exp_stage: "test"
  },
  stim_duration: 300,
  trial_duration: 1300,
  response_ends_trial: false,
  post_trial_gap: 0
};

var other_probe = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: getChar,
  is_html: true,
  choices: [possible_responses[0][1], possible_responses[1][1]],
  data: {
    trial_id: "probe",
    exp_stage: "test"
  },
  stim_duration: 300,
  trial_duration: 1300,
  response_ends_trial: false,
  post_trial_gap: 0
};

/* ************************************ */
/* Set up experiment */
/* ************************************ */


var ax_cpt_experiment = []
var ax_cpt_init = () => {
  var block1_list = jsPsych.randomization.repeat(trial_proportions, 4)
  var block2_list = jsPsych.randomization.repeat(trial_proportions, 4)
  var block3_list = jsPsych.randomization.repeat(trial_proportions, 4)
  var blocks = [block1_list, block2_list, block3_list]
  ax_cpt_experiment.push(instruction_node);
  for (b = 0; b < blocks.length; b++) {
    var block = blocks[b]
    for (i = 0; i < block.length; i++) {
      switch (block[i]) {
        case "AX":
          cue = jQuery.extend(true, {}, A_cue)
          probe = jQuery.extend(true, {}, X_probe)
            cue.data.condition = "AX"
          probe.data.condition = "AX"
          break;
        case "BX":
          cue = jQuery.extend(true, {}, other_cue)
          probe = jQuery.extend(true, {}, X_probe)
          cue.data.condition = "BX"
          probe.data.condition = "BX"
          break;
        case "AY":
          cue = jQuery.extend(true, {}, A_cue)
          probe = jQuery.extend(true, {}, other_probe)
          cue.data.condition = "AY"
          probe.data.condition = "AY"
          break;
        case "BY":
          cue = jQuery.extend(true, {}, other_cue)
          probe = jQuery.extend(true, {}, other_probe)
          cue.data.condition = "BY"
          probe.data.condition = "BY"
          break;
      }
      ax_cpt_experiment.push(cue)
      ax_cpt_experiment.push(probe)
      ax_cpt_experiment.push(wait_block)
    }
    // ax_cpt_experiment.push(attention_node)
    ax_cpt_experiment.push(rest_block)
  }
  ax_cpt_experiment.push(post_task_block)
  ax_cpt_experiment.push(end_block)
}
