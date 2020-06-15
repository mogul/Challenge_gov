$(document).ready(function(){
  const checkbox = $("#challenge_terms_equal_rules")
  const termsInput = $("#challenge_terms_and_conditions")

  let oldTerms = termsInput.val()

  if (checkbox.prop("checked") === true) {
    boxChecked()
  }

  if (checkbox.prop("checked") === false) {
    boxUnchecked()
  }

  checkbox.on("click", function() {
    if ($(this).prop("checked")) {
      boxChecked()
    } else {
      boxUnchecked()
    }
  })

  function boxChecked() {
    oldTerms = termsInput.val()
    termsInput.val("")
    termsInput.prop("disabled", true)
    termsInput.siblings("p").hide()
  }

  function boxUnchecked() {
    termsInput.val(oldTerms)
    termsInput.prop("disabled", false)
    termsInput.siblings("p").show()
  }

  // Legal authority select box
  let legalAuthoritySelect = $("select#challenge_legal_authority")
  let legalAuthorityInput = $("input#challenge_legal_authority")
  let legalAuthorityOptions = legalAuthoritySelect.children("option").map(function() {
    return $(this).val()
  }).get()
  
  if (!legalAuthorityOptions.includes(legalAuthorityInput.val())) {
    showLegalAuthorityOtherField()
  } else {
    hideLegalAuthorityOtherField()
  }

  legalAuthoritySelect.on("change", function() {
    if ($(this).val() === "Other") {
      showLegalAuthorityOtherField()
    } else {
      hideLegalAuthorityOtherField()
    }
  })

  function showLegalAuthorityOtherField() {
    legalAuthoritySelect.val("Other")
    legalAuthorityInput.prop("disabled", false)
    legalAuthorityInput.parents(".form-group").show()
  }

  function hideLegalAuthorityOtherField() {
    legalAuthorityInput.prop("disabled", true)
    legalAuthorityInput.parents(".form-group").hide()
  }
})