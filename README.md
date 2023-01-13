# Repo for testing upgraded versions of [expfactory-experiments](https://github.com/expfactory/expfactory-experiments) experiments.

Fundamental changes between jsPsych versions 6 and 7:
[https://www.jspsych.org/7.3/support/migration-v7/](https://www.jspsych.org/7.3/support/migration-v7/)

## config.json changes

### `run` pathing
Old style config.json had two types of paths. Those that began with `static` were dependencies not found in that experiments directory. Everything else not starting with a `/` was relative to that experiments root. Old jsPsych were pathed as such:
```
        "run": [
                "static/js/jspsych/jspsych.js",
                "style.css"
        ]
```

To maintain backwards compatability the jsPsych 7 distribution was put in a different directory. The above becomes:
```
        "run": [
                "static/jspsych7/jspsych.js",
                "style.css"
        ]
```

### unused keys
Currently to run a converted experiment only the following keys are needed:
    - run
    - exp_id

`deployment_variables` is unused in the new format but may used in the future.

### unused `run` dependencies.
Many experiments config.json have plugins that are not used in their experiments.js, these can be removed.

## experiment.js changes

### General Changes

- Every plugin will need to switch from being a string to being a reference. (https://www.jspsych.org/7.3/support/migration-v7/#the-type-parameter-for-trials)[https://www.jspsych.org/7.3/support/migration-v7/#the-type-parameter-for-trials]
- All choices arguments to plugins will need to specify strings instead of ascii integers [https://www.jspsych.org/7.3/support/migration-v7/#the-choices-parameter-for-keyboard-response-trials](https://www.jspsych.org/7.3/support/migration-v7/#the-choices-parameter-for-keyboard-response-trials)

### `jsPsych` object and init changes

When you load an expfactory experiment `experiment.js` is loaded before the javascript that initializes jsPsych is called. Any top level code in experiment.js will be executed. This is where we define the `{{ exp_id }}_experiment` variable used as the timeline input to jsPsych.

jsPsych 7 does not allow access to the global jsPsych object for most thing. Any calls to the global `jsPsych` object in `experiments.js` that happen outside of a function definition will need to be moved, or rewritten in a way that doesn't call `jsPsych`. In jsPsych 7 `initJsPsych` produces a jsPsych object that can be used like the old `jsPsych` global object was used. 

Old jsPsych needed one function call to start an experiment, while jsPsych 7 needs at least two seperate calls. The following are from the html/js templates used by expfactory packages to serve experiments:

Old style:
```
jsPsych.init({
    timeline: {{ exp_id }}_experiment,
    on_finish: onFinish
})
```

New style:
```
jsPsych = initJsPsych({on_finish: onFinish})
{{ exp_id }}_init()
jsPsych.run({{ exp_id }}_experiment)
```

expfactory_deploy will now assume that you have a function called `{{ exp_id }}_init`. Insde that function's definition the object produced by initJsPsych can be called. That object in the above example is called `jsPsych` to minimize the number of changes that need to be made to upgrade an experiment.js. It may be too confusing, we can change the name.

### Replacing `poldrack_plugins`

The goal is to replace as many poldrack-plugins with built in plugins, and to reduce duplication of mainline jspsych code if a custom plugin is needed.
[https://www.jspsych.org/7.3/plugins/list-of-plugins/](https://www.jspsych.org/7.3/plugins/list-of-plugins/)

| Old plugin | Possible Replacement | Note |
| ---------- | -------------------- | ---- |
| jspsych-attention-check.js | | Could be plugin, could be a function that generates keyboard response |
| jspsych-categorize-audio.js | N/A | Unused by experimentsfactory-experiments |
| jspsych-consent.js | N/A | Unused by experimentfactory-experiments |
| jspsych-poldrack-categorize.js | [jsPsychCategorizeHtml](https://www.jspsych.org/7.3/plugins/categorize-html/) | |
| jspsych-poldrack-instructions.js | [instructions](https://www.jspsych.org/7.3/plugins/instructions/) | old plugin has 'End Instructions' on last page |
| jspsych-poldrack-multi-stim-multi-response.js | | https://github.com/jspsych/jsPsych/discussions/2621 |
| jspsych-poldrack-radio-buttonlist.js | N/A | Unused by experimentfactory-experiments |
| jspsych-poldrack-single-stim.js | [jsPsychHtmlKeyboardResponse](https://www.jspsych.org/7.3/plugins/html-keyboard-response/) | |
| jspsych-poldrack-survey-multi-choice.js | [survey](https://www.jspsych.org/7.3/plugins/survey/) | |
| jspsych-poldrack-text.js | [jsPsychHtmlKeyboardResponse](https://www.jspsych.org/7.3/plugins/html-keyboard-response/) | |
| jspsych-single-stim-button.js | [jsPsychHtmlKeyboardResponse](https://www.jspsych.org/7.3/plugins/html-keyboard-response/) | |
| jspsych-stop-signal.js | N/A | Needs custom plugin. |
| jspsych-writing.js | N/A |only used by writing_task, records rt for each keystroke. |

#### Arguments

Common arguments to poldrack-plugins and their equivelants in jsPsych 7 plugins.
| Old plugin | Possible Replacement | Note |
| ---------- | -------------------- | ---- |
| timing_response | trial_duration | |
| timing_post_trial | post_trial_gap | |

