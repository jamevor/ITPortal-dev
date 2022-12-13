function showGamingSlider() {
    if ($("#laptoptool-hobbies-gaming").prop("checked")) {
        $("#laptoptool-gameslider-div").show()
    } else {
        $("#laptoptool-gameslider-div").hide()
    }
}

$(function () {
    $("#laptoptool-hobbies-gaming").prop("checked", false)
})

loadData()

var ram_translation = {
    0: 8,
    1: 12,
    2: 16,
    3: 24,
    4: 32
}

var currentstep = 0

function calculateScores() {
    // Main personal preferences dictionary
    var personal_prefs = {
        "cpu": 1,
        "gpu": 1,
        "ram": 1,
        "storage": 1,
        "form": 1
    }

    var majors = []
    var hobbies = []
    // Array corresponds to the games storage usage per category.
    var games_usage = [5, 10, 50, 100]
    var gamingpicked = false
    var gameslider_val = 1

    // Dump majors to dictionary
    $("input[name='major']:checked").each(function () {
        majors.push(this.value)
    })

    // Dump hobbies to dictionary. Extra code has to be used for gaming, since there's 4 sub-hobbies
    // (for the 4 different levels of gaming).
    $("input[name='hobbies']:checked").each(function () {
        if (this.value == "gaming") {
            hobbies.push("gaming_" + $("input[name='gameslider']:checked").val())
            gamingpicked = true
            gameslider_val = parseInt($("input[name='gameslider']:checked").val())
        } else {
            hobbies.push(this.value)
        }
    })

    // Determine the highest requirement for majors & hobbies for the final calculation.
    majors.forEach(major => {
        Object.keys(personal_prefs).forEach(function(key) {
            if (specs_majors_v2[major][key] > personal_prefs[key]) {
                personal_prefs[key] = specs_majors_v2[major][key]
            }
        });
    })

    hobbies.forEach(hobby => {
        Object.keys(personal_prefs).forEach(function (key) {
            if (specs_hobbies_v2[hobby][key] > personal_prefs[key]) {
                personal_prefs[key] = specs_hobbies_v2[hobby][key]
            }
        })
    })

    // Calculate RAM usage here from tabs/programs slider
    var ramprefs_overrides = false
    var tabs_ram = parseInt($("#laptoptool-tabsslider").val()) / 5
    var tabs_programs = parseInt($("#laptoptool-programslider").val()) / 2
    // Ultimately this is the final GB being used by the user.
    var user_ram = tabs_ram + tabs_programs
    // String for the here's why in memory.
    var ram_string = "~" + $("#laptoptool-tabsslider").val() + " tabs open, and ~" + $("#laptoptool-programslider").val() + " programs open"
    // RAM Step translation. Basically just a second array that has the RAM values per "step" as numbers. See the specs.json file for a good idea.
    var ram_map = specs_translation_v2["ram_steps"]
    var ram_step = 0
    // Because the RAM steps are more coarse than what a user can do with the sliders, get the next highest step for their RAM usage.
    // e.g. 9 GB rounds up to 12 GB.
    for (ram_step = 0; ram_step < ram_step.length; ram_step++) {
        if (ram_map[ram_step] > user_ram) {
            break
        }
    }

    // If the RAM step is overriding the major requirements, indicate this.
    // This is used for the bare minimum, telling the code not to subtract from RAM because the user
    // really needs this much memory.
    if (ram_step > personal_prefs['ram']) {
        ramprefs_overrides = true
        personal_prefs['ram'] = ram_step
    }

    // Overbounds protection.
    if (personal_prefs['ram'] > 4) {
        personal_prefs['ram'] = 4
    }

    // New storage algorithm.
    // This does all the fancy storage calculation stuff. Multiplication is for scaling.
    var storageprefs_overrides = false
    var music_storage = parseInt($("#laptoptool-music-slider").val()) * 0.005
    var photo_storage = parseInt($("#laptoptool-photo-slider").val()) * 0.005
    var video_storage = parseInt($("#laptoptool-video-slider").val()) * 0.2
    var movie_storage = parseInt($("#laptoptool-movie-slider").val()) * 5
    var program_storage = parseInt($("#laptoptool-programs-slider").val()) * 1
    var games_storage = parseInt($("#laptoptool-games-slider").val()) * games_usage[gameslider_val]
    var small_storage = parseInt($("#laptoptool-small-file-slider").val()) * 0.050
    var large_storage = parseInt($("#laptoptool-large-file-slider").val()) * 1

    var totalstorage = photo_storage + music_storage + movie_storage + program_storage + games_storage + small_storage + large_storage + video_storage
    // Same methodology for RAM in terms of how we do Storage.
    var storage_map = specs_translation_v2["storage_steps"]
    var storage_step = 0
    for (storage_step = 0; storage_step < storage_map.length; storage_step++) {
        if (storage_map[storage_step] > totalstorage) {
            break
        }
    }

    if (storage_step > personal_prefs['storage']) {
        storageprefs_overrides = true
        personal_prefs['storage'] = storage_step
    }

    if (personal_prefs['storage'] > 4) {
        personal_prefs['storage'] = 4
    }
    // Checking for secondary storage/bare minimum inputs.
    var secondary = $("input[name='secondary']:checked").val()
    var bareminimum = $("input[name='bare-minimum']:checked").val()

    // This allows for the extra power system, while also being backwards compatible with the Bare Minimum system.
    var offsets = {
        "cpu": 0,
        "gpu": 0,
        "ram": 0,
        "storage": 0,
        "form": 0
    }
    var bm_offset_key = ""

    if (bareminimum == "1") {
        // This will subtract -1 from every key that isn't storage/ram that was overrided earlier.
        Object.keys(personal_prefs).forEach(function (key) {
            if (key == "storage" && storageprefs_overrides) {
                
            } else if (key == "ram" && ramprefs_overrides) {

            } else {
                personal_prefs[key] = personal_prefs[key] - 1
                offsets[key] = offsets[key] + 1
            }
        })
        // The BM Offset is used to offset some fun logic used in string generation.
        // Strings are added only if the string associated with that major/hobby in that category MATCHES the personal preferences (highest requirement).
        // But if your major was your highest requirement, and you just bare minimumed, now zero strings will match. So add back 1 so they can match.
        // The BM Offset Key is so that if you're doing bare minimum, you get a separate set of strings.
        bm_offset_key = "_bare"
    }

    var extrapower = []
    $("input[name='extrapower']:checked").each(function () {
        personal_prefs[this.value] = personal_prefs[this.value] + 1
        offsets[this.value] = offsets[this.value] - 1
        extrapower.push(this.value)
    })

    // Enable extra power system


    Object.keys(personal_prefs).forEach(function (key) {
        // Special keys for storage to add secondary text.

        if (key == "storage" && secondary == "1") {
            $("#laptoptool-" + key + "-header").html(specs_translation_v2[key][personal_prefs[key]] + " w/ " + specs_translation_v2[key + "_secondary"][personal_prefs[key]] + " secondary")
            $("#laptoptool-" + key + "-product").html(specs_translation_v2[key][personal_prefs[key]] + " w/ " + specs_translation_v2[key + "_secondary"][personal_prefs[key]] + " secondary")
        } else {
            $("#laptoptool-" + key + "-header").html(specs_translation_v2[key][personal_prefs[key]])
            $("#laptoptool-" + key + "-product").html(specs_translation_v2[key][personal_prefs[key]])
        }
        $("#laptoptool-" + key + "-reasons").empty()

        // Print strings for highest matching major/hobbies, with all the offset stuff.
        majors.forEach(major => {
            if (strings_majors_v2[major][key] != undefined && specs_majors_v2[major][key] == (personal_prefs[key] + offsets[key])) {
                $("#laptoptool-" + key + "-reasons").append("<li>" + strings_majors_v2[major]["prefix"] + " " + strings_majors_v2[major][key + bm_offset_key] + "</li>")
            }
        })

        hobbies.forEach(hobby => {
            if (strings_hobbies_v2[hobby][key] != undefined && specs_hobbies_v2[hobby][key] == (personal_prefs[key] + offsets[key])) {
                $("#laptoptool-" + key + "-reasons").append("<li>" + strings_hobbies_v2[hobby]["prefix"] + " " + strings_hobbies_v2[hobby][key + bm_offset_key] + "</li>")
            }
        })
        
        if (personal_prefs[key] >= 3) {
            $("#laptoptool-" + key + "-specialized").show()
        } else {
            $("#laptoptool-" + key + "-specialized").hide()
        }
    })

    // Append RAM string.
    $("#laptoptool-ram-reasons").append("<li>" + strings_other_v2["tabs_programs"]["base"] + ram_string + strings_other_v2["tabs_programs"]["base_pt3"] + "</li>")

    // Append Storage string.
    $("#laptoptool-storage-reasons").append("<li>Based on how much you store on your laptop, we think this amount of storage should work for you.")
    if (secondary == "1") {
        $("#laptoptool-storage-reasons").append("<li>" + strings_other_v2["storage"]["base_2"] + "</li>")
    }

    Object.keys(personal_prefs).forEach(function (key) {
        if (extrapower.includes(key)) {
            $("#laptoptool-" + key + "-reasons").append("<li>" + strings_other_v2["extrapower"][key] + "</li>")
        }
    })

    // Show bare minimum text.
    if (bareminimum == "1") {
        $("#laptoptool-bare_minimum_0_score").show()
        $("#laptoptool-bare_minimum_0_score").html(strings_other_v2['bare_minimum']['0_score'])
    } else {
        $("#laptoptool-bare_minimum_0_score").hide()
    }

    $("#laptoptool-os-text").empty()
    // Show major OS text. For 1 major, show the normal OS text.
    // For multiple majors, figure out the OS requirements, then show a string as appropriate.
    var os_chosen;
    var os_text;
    if (majors.length == 1) {
        $("#laptoptool-os-text").append(strings_majors_v2[majors[0]]["os"])
        os_chosen = specs_majors_v2[majors[0]]["os"]
    } else {
        // A simple system to figure out if we need to show the both OS string or just the Windows only string.
        // Probably could be made more efficient.
        var os = 1
        majors.forEach(major => {
            if (specs_majors_v2[major]["os"] == 2) {
                os = 2
            }
        })

        if (os == 1) {
            $("#laptoptool-os-text").append(strings_other_v2["os"]["dualmajor_both"])
        } else {
            $("#laptoptool-os-text").append(strings_other_v2["os"]["dualmajor_winonly"])
        }

        os_chosen = os
    }

    if (os_chosen == 1) {
        os_text = "Any OS"
    } else if (os_chosen == 2) {
        os_text = "Windows only"
    }

    window.scroll(0, 0)

    // Generate text for hub submit thing
    var hubtext = ""
    hubtext += "Majors: " + majors.join(", ") + "\nHobbies: " + hobbies.join(", ") + "\n--------------\n"
    hubtext += "Programs: " + $("#laptoptool-programslider").val() + "\n"
    hubtext += "Tabs: " + $("#laptoptool-tabsslider").val() + "\n"
    hubtext += "RAM calculated: " + user_ram + " GB\n--------------\n" 
    hubtext += "Photos: " + $("#laptoptool-photo-slider").val() + "\n"
    hubtext += "Videos: " + $("#laptoptool-video-slider").val() + "\n"
    hubtext += "Songs: " + $("#laptoptool-music-slider").val() + "\n"
    hubtext += "Movies: " + $("#laptoptool-movie-slider").val() + "\n"
    hubtext += "Programs: " + $("#laptoptool-programs-slider").val() + "\n"
    hubtext += "Games: " + $("#laptoptool-games-slider").val() + "\n"
    hubtext += "Small files: " + $("#laptoptool-small-file-slider").val() + "\n"
    hubtext += "Large files: " + $("#laptoptool-large-file-slider").val() + "\n"
    hubtext += "Storage calculated: " + totalstorage + " GB\n--------------\n"
    hubtext += "Extra power: " + extrapower.join(", ") + "\n"
    hubtext += "Secondary drive: " + secondary + "\n"
    hubtext += "Bare minimum: " + bareminimum + "\n--------------\n"
    hubtext += "CPU recommended: " + $("#laptoptool-cpu-header").html() + " (" + personal_prefs["cpu"] + ")\n"
    hubtext += "RAM recommended: " + $("#laptoptool-ram-header").html() + " (" + personal_prefs["ram"] + ")\n"
    hubtext += "GPU recommended: " + $("#laptoptool-gpu-header").html() + " (" + personal_prefs["gpu"] + ")\n"
    hubtext += "Storage recommended: " + $("#laptoptool-storage-header").html() + " (" + personal_prefs["storage"] + ")\n"
    hubtext += "Form recommended: " + $("#laptoptool-form-header").html() + " (" + personal_prefs["form"] + ")\n"
    hubtext += "OS recommended: " + os_text + " (" + os_chosen + ")"

    $("#laptoptool-diagnostic-textarea").val(hubtext)

    $("#laptoptool-diagnostic-textdiv").hide()
}

function redoAnswers() {
    stepChange(5, 0)
}

function clearAnswers() {
    $("input[name='major']").prop("checked", false)
    $("input[name='hobbies']").prop("checked", false)
    $("#laptoptool-gameslider-div").hide()
    $("#laptoptool-programslider").val("0")
    $("#laptoptool-tabsslider").val("0")
    $("#laptoptool-photo-slider").val("0")
    $("#laptoptool-music-slider").val("0")
    $("#laptoptool-movie-slider").val("0")
    $("#laptoptool-programs-slider").val("0")
    $("#laptoptool-games-slider").val("0")
    $("#laptoptool-small-file-slider").val("0")
    $("#laptoptool-large-file-slider").val("0")
    $("input[name='secondary']").prop("checked", false)
    $("input[name='bare-minimum']").prop("checked", false)
    $("input[name='extrapower']").prop("checked", false)
    $("input[name='gameslider']").prop("checked", false)
}

function stepChange(start, end, bypassvalidation) {
    var direction = 0
    if (start < end) {
        direction = 1
    } else if (start > end) {
        direction = -1
    }

    if (bypassvalidation != true) {
        if (direction == 1 && end >= 2 && start <= 1) {
            var result = validates1(false)
            if (!result) {
                stepChange(start, 1, true)
                return
            }
        }
    
        if (direction == 1 && end >= 3 && start <= 2) {
            var result = validates2(false)
            if (!result) {
                stepChange(start, 2, true)
                return
            }
        }

        if (direction == 1 && end >= 5 && start <= 4) {
            var result = validates4(false)
            if (!result) {
                stepChange(start, 4, true)
                return
            }
        }
    }

    $("#laptoptool-step" + start).hide()
    $("#laptoptool-step" + end).show()
    currentstep = end
    if (end >= 1 && end <= 4) {
        $("#laptoptool-progress-indicator").show()
    } else {
        $("#laptoptool-progress-indicator").hide()
    }

    // This is a generalized for loop to hit all the points on the progress indicator.
    // If we're moving forward, all points need to be marked as complete, with the ending point being current.
    // If we're moving backward, then all points need to be marked as incomplete.
    for (var i = start; i != end; i = i + direction) {
        if (direction == 1) {
            $("#laptoptool-progress-indicator-" + i).attr("class", "is-complete progress-indicator-step")
        } else if (direction == -1) {
            $("#laptoptool-progress-indicator-" + i).attr("class", "progress-indicator-step")
        }
    }

    $("#laptoptool-progress-indicator-" + end).attr("class", "is-current")
    window.scroll(0, 0)
}

$(function () {
    clearAnswers()
})

function updateLabel(src, label, scale, suffix) {
    $("#laptoptool-" + label).html((parseInt($("#laptoptool-" + src).val()) * scale) + " " + suffix)
}

// Small validation helpers for steps 1 & 2.
function validates1(autochange) {
    var testmajors = []
    $("input[name='major']:checked").each(function () {
        testmajors.push(this.value)
    })

    if (testmajors.length < 1) {
        $("#laptoptool-validation-major").show()
        $("#laptoptool-validation-s1-small").show()
        return false
    } else {
        $("#laptoptool-validation-major").hide()
        if (autochange != false) {
            stepChange(1, 2, true)
        }
        $("#laptoptool-validation-s1-small").hide()
        return true
    }
}

function validates2(autochange) {
    var validationpassed = true

    if ($("#laptoptool-tabsslider").val() == "0") {
        $("#laptoptool-validation-tabs").show()
        validationpassed = false
    } else {
        $("#laptoptool-validation-tabs").hide()
    }

    if ($("#laptoptool-programslider").val() == "0") {
        $("#laptoptool-validation-programs").show()
        validationpassed = false
    } else {
        $("#laptoptool-validation-programs").hide()
    }

    if ($("input[name='gameslider']:checked").val() == undefined && $("#laptoptool-hobbies-gaming").prop("checked")) {
        $("#laptoptool-validation-games").show()
        validationpassed = false
    } else {
        $("#laptoptool-validation-games").hide()
    }

    if (validationpassed) {
        if (autochange != false) {
            stepChange(2, 3, true)
        }
        $("#laptoptool-validation-s2-small").hide()
        return true
    } else {
        $("#laptoptool-validation-s2-small").show()
        return false
    }
}

function validates4(autochange) {
    var validationpassed = true
    if ($("input[name='secondary']:checked").val() == undefined) {
        $("#laptoptool-validation-secondary").show()
        validationpassed = false
    } else {
        $("#laptoptool-validation-secondary").hide()
    }

    if ($("input[name='bare-minimum']:checked").val() == undefined) {
        $("#laptoptool-validation-bareminimum").show()
        validationpassed = false
    } else {
        $("#laptoptool-validation-bareminimum").hide()
    }

    if (validationpassed) {
        if (autochange != false) {
            stepChange(4, 5, true)
        }
        $("#laptoptool-validation-s4-small").hide()
        return true
    } else {
        $("#laptoptool-validation-s4-small").show()
        return false
    }
}
