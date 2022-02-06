'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">@egoistdeveloper/ng-keyboard-shortcuts-app documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/KeyboardShortcutsModule.html" data-type="entity-link" >KeyboardShortcutsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-KeyboardShortcutsModule-d45de074ca9ad09d2fad4da7c6538750d39637db6075d13969cb278e38dc8913607335b578256b1e0cf4c1435f5374be10308eeb8e313294a96025a96ed81287"' : 'data-target="#xs-components-links-module-KeyboardShortcutsModule-d45de074ca9ad09d2fad4da7c6538750d39637db6075d13969cb278e38dc8913607335b578256b1e0cf4c1435f5374be10308eeb8e313294a96025a96ed81287"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-KeyboardShortcutsModule-d45de074ca9ad09d2fad4da7c6538750d39637db6075d13969cb278e38dc8913607335b578256b1e0cf4c1435f5374be10308eeb8e313294a96025a96ed81287"' :
                                            'id="xs-components-links-module-KeyboardShortcutsModule-d45de074ca9ad09d2fad4da7c6538750d39637db6075d13969cb278e38dc8913607335b578256b1e0cf4c1435f5374be10308eeb8e313294a96025a96ed81287"' }>
                                            <li class="link">
                                                <a href="components/KeyboardShortcutsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >KeyboardShortcutsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/KeyboardShortcutsHelpComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >KeyboardShortcutsHelpComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-KeyboardShortcutsModule-d45de074ca9ad09d2fad4da7c6538750d39637db6075d13969cb278e38dc8913607335b578256b1e0cf4c1435f5374be10308eeb8e313294a96025a96ed81287"' : 'data-target="#xs-directives-links-module-KeyboardShortcutsModule-d45de074ca9ad09d2fad4da7c6538750d39637db6075d13969cb278e38dc8913607335b578256b1e0cf4c1435f5374be10308eeb8e313294a96025a96ed81287"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-KeyboardShortcutsModule-d45de074ca9ad09d2fad4da7c6538750d39637db6075d13969cb278e38dc8913607335b578256b1e0cf4c1435f5374be10308eeb8e313294a96025a96ed81287"' :
                                        'id="xs-directives-links-module-KeyboardShortcutsModule-d45de074ca9ad09d2fad4da7c6538750d39637db6075d13969cb278e38dc8913607335b578256b1e0cf4c1435f5374be10308eeb8e313294a96025a96ed81287"' }>
                                        <li class="link">
                                            <a href="directives/KeyboardShortcutsDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >KeyboardShortcutsDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/KeyboardShortcutsHelpService.html" data-type="entity-link" >KeyboardShortcutsHelpService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/KeyboardShortcutsSelectService.html" data-type="entity-link" >KeyboardShortcutsSelectService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/KeyboardShortcutsService.html" data-type="entity-link" >KeyboardShortcutsService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Shortcut.html" data-type="entity-link" >Shortcut</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ShortcutEventOutput.html" data-type="entity-link" >ShortcutEventOutput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ShortcutInput.html" data-type="entity-link" >ShortcutInput</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});