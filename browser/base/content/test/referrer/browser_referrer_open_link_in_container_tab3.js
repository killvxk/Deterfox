// Tests referrer on context menu navigation - open link in new container tab.
// Selects "open link in new container tab" from the context menu.

// The test runs from a container ID 2.
// Output: we have no referrer.

function getReferrerTest(aTestNumber) {
  let test = _referrerTests[aTestNumber];
  if (test) {
    // We want all the referrer tests to fail!
    test.result = "";
  }

  return test;
}

function startNewTabTestCase(aTestNumber) {
  info("browser_referrer_open_link_in_container_tab: " +
       getReferrerTestDescription(aTestNumber));
  contextMenuOpened(gTestWindow, "testlink").then(function(aContextMenu) {
    someTabLoaded(gTestWindow).then(function(aNewTab) {
      gTestWindow.gBrowser.selectedTab = aNewTab;

      checkReferrerAndStartNextTest(aTestNumber, null, aNewTab,
                                    startNewTabTestCase, { userContextId: 2 });
    });

    let menu = gTestWindow.document.getElementById("context-openlinkinusercontext-menu");

    let menupopup = menu.menupopup;
    menu.addEventListener("popupshown", function onPopupShown() {
      menu.removeEventListener("popupshown", onPopupShown);

      is(menupopup.nodeType, Node.ELEMENT_NODE, "We have a menupopup.");
      ok(menupopup.firstChild, "We have a first container entry.");

      let firstContext = menupopup.firstChild;
      is(firstContext.nodeType, Node.ELEMENT_NODE, "We have a first container entry.");
      ok(firstContext.hasAttribute("usercontextid"), "We have a usercontextid value.");
      is("0", firstContext.getAttribute("usercontextid"), "We have the right usercontextid value.");

      aContextMenu.addEventListener("popuphidden", function onPopupHidden() {
        aContextMenu.removeEventListener("popuphidden", onPopupHidden);
        firstContext.doCommand();
      });

      aContextMenu.hidePopup();
    });

    menupopup.showPopup();
  });
}

function test() {
  waitForExplicitFinish();

  SpecialPowers.pushPrefEnv(
    {set: [["privacy.userContext.enabled", true]]},
    function() {
      requestLongerTimeout(10);  // slowwww shutdown on e10s
      startReferrerTest(startNewTabTestCase, { userContextId: 2 });
    });
}
