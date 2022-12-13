var specs_translation_v2 = {};
var specs_majors_v2 = {};
var specs_hobbies_v2 = {};
var strings_majors_v2 = {};
var strings_hobbies_v2 = {};
var strings_other_v2 = {};

function xhrloader(url, variable) {
    var xhr = new XMLHttpRequest()
    xhr.open("GET", url, true)
    xhr.timeout = 60000
    xhr.send();
    xhr.onload = function() {
        window[variable] = JSON.parse(xhr.responseText)
    }
}

// URL, then the variable name by string.
var jsonToLoad = [
    ["/js/pages/laptop-rec/json/specs/specs.json", "specs_translation_v2"],
    ["/js/pages/laptop-rec/json/specs/majors.json", "specs_majors_v2"],
    ["/js/pages/laptop-rec/json/specs/hobbies.json", "specs_hobbies_v2"],
    ["/js/pages/laptop-rec/json/strings/majors.json", "strings_majors_v2"],
    ["/js/pages/laptop-rec/json/strings/hobbies.json", "strings_hobbies_v2"],
    ["/js/pages/laptop-rec/json/strings/other.json", "strings_other_v2"]
]

function loadData() {
    for (var i = 0; i < jsonToLoad.length; i++) {
        xhrloader(jsonToLoad[i][0], jsonToLoad[i][1])
    }
}