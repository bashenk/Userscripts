// ==UserScript==
// @name         WaniKani Media Context Sentences
// @description  Formerly named "Wanikani Anime Sentences 2". Adds example sentences from anime, dramas, games, literature, and news for vocabulary from https://www.immersionkit.com.
// @version      4.0.0
// @author       Inserio
// @namespace    https://greasyfork.org/en/users/11878
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @require      https://greasyfork.org/scripts/430565-wanikani-item-info-injector/code/WaniKani%20Item%20Info%20Injector.user.js?version=1416982
// @copyright    2021+, Paul Connolly
// @copyright    2024-2025, Brian Shenk
// @license      MIT; http://opensource.org/licenses/MIT
// @run-at       document-body
// @grant        none
// ==/UserScript==
/* jshint esversion: 11 */
// noinspection CssUnusedSymbol,CssInvalidPropertyValue,CssUnresolvedCustomProperty,JSUnusedGlobalSymbols,JSNonASCIINames
/* global wkItemInfo */
(() => {
    'use strict';
    const {wkof} = window, scriptName = 'Media Context Sentences', scriptId = 'media-context-sentences', styleSheetName = `${scriptId}-style`, scriptVersion = '4.0.0';
    const state = {
        settings: {
            // The maximum height of the container box. If no unit type is provided, px (pixels) is automatically appended.
            maxBoxHeight: '320px',
            // 0 = No limit
            exampleLimit: 0,
            // Allows the box to appear in the Examples tab for kanji as well
            showOnKanji: false,
            // Options: always|onhover|onclick
            showJapanese: 'always',
            // Options: always|onhover|never
            showFurigana: 'onhover',
            // Options: always|onhover|onclick
            showEnglish: 'onhover',
            // Options: exact|fuzzy // TODO: Implement
            highlighting: 'exact',
            // If true, will restart the audio track from the beginning when the user pauses.
            // If false, will save the current position and resume from there the next time that sentence is played.
            restartAudioOnPause: true,
            // Playback speed in percent = (playbackRate * 2)
            playbackRate: 50,
            // Playback volume in percent
            playbackVolume: 100,
            // If greater than 0, will attempt to retry fetching results if none were found.
            fetchRetryCount: 0,
            // Milliseconds to wait before retrying fetch
            fetchRetryDelay: 5000,
            // Options: default|category|shortness|longness|position
            sentenceSorting: 'default',
            // Options: default(none)|category|shortness|longness|position
            sentenceSortingSecondary: 'default',
            // Mapping of the content title to the enabled state. All content is enabled by default.
            // Titles are taken from https://www.immersionkit.com/information and modified after testing a few example search results.
            filters: {
                // Filters the results to only those with sentences exactly matching the keyword (i.e., this filters after the results are found)
                // TODO: Make the kanji (i.e., not the okurigana) required by default for non-kana-only vocab
                exactMatch: false,
                // Wraps the search term in Japanese quotes (i.e., 「term」) before sending it to Immersion Kit
                exactSearch: false,
                // Tells Immersion Kit to filter out results containing words more than 1 level higher than the current WaniKani level (possibly inaccurate, due to frequent changes in WK level contents)
                waniKaniLevel: false,
                // If greater than 0, tells Immersion Kit to filter out results that are not at the selected JLPT level or easier.
                jLPTLevel: 0,
                // Including the full lists for v1 compatability
                lists: {
                    anime: {
                        [`Alya Sometimes Hides Her Feelings in Russian`]: true,
                        [`Angel Beats!`]: true,
                        [`Anohana the flower we saw that day`]: true,
                        [`Assassination Classroom Season 1`]: true,
                        [`Bakemonogatari`]: true,
                        [`Boku no Hero Academia Season 1`]: true,
                        [`Bunny Drop`]: true,
                        [`Cardcaptor Sakura`]: true,
                        [`Castle in the sky`]: true,
                        [`Chobits`]: true,
                        [`Clannad After Story`]: true,
                        [`Clannad`]: true,
                        [`Code Geass Season 1`]: true,
                        [`Daily Lives of High School Boys`]: true,
                        [`Death Note`]: true,
                        [`Demon Slayer - Kimetsu no Yaiba`]: true,
                        [`Durarara!!`]: true,
                        [`Erased`]: true,
                        [`Fairy Tail`]: true,
                        [`Fate Stay Night Unlimited Blade Works`]: true,
                        [`Fate Zero`]: true,
                        [`From Up on Poppy Hill`]: true,
                        [`From the New World`]: true,
                        [`Fruits Basket Season 1`]: true,
                        [`Fullmetal Alchemist Brotherhood`]: true,
                        [`Girls Band Cry`]: true,
                        [`God's Blessing on this Wonderful World!`]: true,
                        [`Grave of the Fireflies`]: true,
                        [`Haruhi Suzumiya`]: true,
                        [`Howl's Moving Castle`]: true,
                        [`Hunter × Hunter`]: true,
                        [`Hyouka`]: true,
                        [`Is The Order a Rabbit`]: true,
                        [`K-On!`]: true,
                        [`Kakegurui`]: true,
                        [`Kanon (2006)`]: true,
                        [`Kiki's Delivery Service`]: true,
                        [`Kill la Kill`]: true,
                        [`Kino's Journey`]: true,
                        [`Kokoro Connect`]: true,
                        [`Little Witch Academia`]: true,
                        [`Lucky Star`]: true,
                        [`Mahou Shoujo Madoka Magica`]: true,
                        [`Mononoke`]: true,
                        [`My Little Sister Can't Be This Cute`]: true,
                        [`My Neighbor Totoro`]: true,
                        [`New Game!`]: true,
                        [`Nisekoi`]: true,
                        [`No Game No Life`]: true,
                        [`Noragami`]: true,
                        [`One Week Friends`]: true,
                        [`Only Yesterday`]: true,
                        [`Princess Mononoke`]: true,
                        [`Psycho Pass`]: true,
                        [`Re Zero − Starting Life in Another World`]: true,
                        [`ReLIFE`]: true,
                        [`Shirokuma Cafe`]: true,
                        [`Sound! Euphonium`]: true,
                        [`Spirited Away`]: true,
                        [`Steins Gate`]: true,
                        [`Sword Art Online`]: true,
                        [`The Cat Returns`]: true,
                        [`The Garden of Words`]: true,
                        [`The Girl Who Leapt Through Time`]: true,
                        [`The Pet Girl of Sakurasou`]: true,
                        [`The Secret World of Arrietty`]: true,
                        [`The Wind Rises`]: true,
                        [`The World God Only Knows`]: true,
                        [`Toradora!`]: true,
                        [`Wandering Witch The Journey of Elaina`]: true,
                        [`Weathering with You`]: true,
                        [`When Marnie Was There`]: true,
                        [`Whisper of the Heart`]: true,
                        [`Wolf Children`]: true,
                        [`Your Lie in April`]: true,
                        [`Your Name`]: true,
                    },
                    drama: {
                        [`1 Litre of Tears`]: true,
                        [`Border`]: true,
                        [`Good Morning Call`]: true, // Exists in the APIv2 list, but APIv1 splits it into two
                        [`Good Morning Call Season 1`]: true, // Exists in the APIv1 list, but not in the APIv2 list
                        [`Good Morning Call Season 2`]: true,
                        [`I am Mita, Your Housekeeper`]: true,
                        [`I'm Taking the Day Off`]: true,
                        [`Legal High Season 1`]: true,
                        [`Million Yen Woman`]: true,
                        [`Mob Psycho 100`]: true,
                        [`Overprotected Kahoko`]: true,
                        [`Quartet`]: true,
                        [`Sailor Suit and Machine Gun (2006)`]: true,
                        [`Smoking`]: true,
                        [`The Journalist`]: true,
                        [`Weakest Beast`]: true,
                    },
                    games: {
                        [`Cyberpunk 2077`]: true, [`Skyrim`]: true, [`Witcher 3`]: true,
                        // The following are currently not queryable via the API (but maybe they will be someday?)
                        // [`NieR: Automata`]: true, [`NieR Re[in]carnation`]: true, [`Zelda: Breath of the Wild`]: true,
                    },
                    literature: {
                        [`黒猫`]: true,
                        [`おおかみと七ひきのこどもやぎ`]: true,
                        [`マッチ売りの少女`]: true,
                        [`サンタクロースがやってきた`]: true,
                        [`君死にたまふことなかれ`]: true,
                        [`蝉`]: true,
                        [`胡瓜`]: true,
                        [`若鮎について`]: true,
                        [`黒足袋`]: true,
                        [`柿`]: true,
                        [`お母さんの思ひ出`]: true,
                        [`砂をかむ`]: true,
                        [`虻のおれい`]: true,
                        [`がちゃがちゃ`]: true,
                        [`犬のいたずら`]: true,
                        [`犬と人形`]: true,
                        [`懐中時計`]: true,
                        [`きのこ会議`]: true,
                        [`お金とピストル`]: true,
                        [`梅のにおい`]: true,
                        [`純真`]: true,
                        [`声と人柄`]: true,
                        [`心の調べ`]: true,
                        [`愛`]: true,
                        [`期待と切望`]: true,
                        [`空の美`]: true,
                        [`いちょうの実`]: true,
                        [`虔十公園林`]: true,
                        [`クねずみ`]: true,
                        [`おきなぐさ`]: true,
                        [`さるのこしかけ`]: true,
                        [`セロ弾きのゴーシュ`]: true,
                        [`ざしき童子のはなし`]: true,
                        [`秋の歌`]: true,
                        [`赤い船とつばめ`]: true,
                        [`赤い蝋燭と人魚`]: true,
                        [`赤い魚と子供`]: true,
                        [`秋が　きました`]: true,
                        [`青いボタン`]: true,
                        [`ある夜の星たちの話`]: true,
                        [`いろいろな花`]: true,
                        [`からすとかがし`]: true,
                        [`片田舎にあった話`]: true,
                        [`金魚売り`]: true,
                        [`小鳥と兄妹`]: true,
                        [`おじいさんが捨てたら`]: true,
                        [`おかめどんぐり`]: true,
                        [`お母さん`]: true,
                        [`お母さんのお乳`]: true,
                        [`おっぱい`]: true,
                        [`少年と秋の日`]: true,
                        [`金のくびかざり`]: true,
                        [`愛よ愛`]: true,
                        [`気の毒な奥様`]: true,
                        [`新茶`]: true,
                        [`初夏に座す`]: true,
                        [`三角と四角`]: true,
                        [`赤い蝋燭`]: true,
                        [`赤とんぼ`]: true,
                        [`飴だま`]: true,
                        [`あし`]: true,
                        [`がちょうのたんじょうび`]: true,
                        [`ごん狐`]: true,
                        [`蟹のしょうばい`]: true,
                        [`カタツムリノ ウタ`]: true,
                        [`木の祭り`]: true,
                        [`こぞうさんのおきょう`]: true,
                        [`去年の木`]: true,
                        [`おじいさんのランプ`]: true,
                        [`王さまと靴屋`]: true,
                        [`落とした一銭銅貨`]: true,
                        [`サルト サムライ`]: true,
                        [`里の春、山の春`]: true,
                        [`ウサギ 新美 南吉`]: true,
                        [`あひるさん と 時計`]: true,
                        [`川へおちた玉ねぎさん`]: true,
                        [`小ぐまさんのかんがへちがひ`]: true,
                        [`お鍋とお皿とカーテン`]: true,
                        [`お鍋とおやかんとフライパンのけんくわ`]: true,
                        [`ひらめの学校`]: true,
                        [`狐物語`]: true,
                        [`桜の樹の下には`]: true,
                        [`瓜子姫子`]: true,
                        [`ああしんど`]: true,
                        [`葬式の行列`]: true,
                        [`風`]: true,
                        [`子どものすきな神さま`]: true,
                        [`喫茶店にて`]: true,
                        [`子供に化けた狐`]: true,
                        [`顔`]: true,
                        [`四季とその折々`]: true,
                    },
                    news: {
                        [`平成30年阿蘇神社で甘酒の仕込み始まる`]: true,
                        [`フレッシュマン！5月号阿蘇広域行政事務組合`]: true,
                        [`フレッシュマン！7月号春工房、そば処ゆう雀`]: true,
                        [`フレッシュマン！11月号内牧保育園`]: true,
                        [`山田小学校で最後の稲刈り`]: true,
                    },
                },
            },
            // Immersion Kit API Version
            immersionKitAPIVersion: '2',
            // Enables debugging statements to find and help remedy bugs when they occur.
            debugging: false,
            // This works as a "fail-early" measure and will not show any normal results when an issue is found.
            failWhenHidden: false,
            // The current version of the stored settings
            version: scriptVersion,
        },
        // Default options for configuring the settings dialog (memoized)
        get options() { delete this.options; this.options = {
                showText: {always: 'Always', onhover: 'On Hover', onclick: 'On Click'},
                showFurigana: {always: 'Always', onhover: 'On Hover', never: 'Never'},
                jlpt: {0: 'No Filter', 1: 'N1', 2: 'N2', 3: 'N3', 4: 'N4', 5: 'N5'},
                immersionKitAPIVersion: {'1': 'v1', '2': 'v2'},
                sortingMethods: {
                    default: 'Default',
                    category: 'Category (anime, drama, etc.)',
                    source: 'Source Title',
                    shortness: 'Shortest sentences first',
                    longness: 'Longest sentences first',
                    position: 'Position of keyword in sentence',
                },
                secondarySortingMethodsToHide(primarySortingMethod) {
                    const keysToHide = [];
                    switch (primarySortingMethod) {
                        case 'category':
                            keysToHide.push('category');
                            break;
                        case 'longness':
                        case 'shortness':
                            keysToHide.push('shortness');
                            keysToHide.push('longness');
                            break;
                        case 'source':
                            keysToHide.push('category');
                            keysToHide.push('source');
                            break;
                        case 'position':
                            keysToHide.push('position');
                            break;
                        case 'default':
                        default:
                            keysToHide.push('category');
                            keysToHide.push('source');
                            keysToHide.push('shortness');
                            keysToHide.push('longness');
                            keysToHide.push('position');
                            break;
                    }
                    return keysToHide;
                },
                secondarySortingMethods(primarySortingMethod) {
                    const sortingMethodsCopy = Object.assign({}, this.sortingMethods);
                    for (const oldKey of this.secondarySortingMethodsToHide(primarySortingMethod)) {
                        // we do a little cheeky attribute injection for wkof's list generation...
                        const newKey = `${oldKey}" class="hidden`;
                        sortingMethodsCopy[newKey] = sortingMethodsCopy[oldKey];
                        delete sortingMethodsCopy[oldKey];
                    }
                    return sortingMethodsCopy;
                },
            }; return this.options; },
        get userLevel() { return wkof ? wkof.user.level : 0; },
        // Used for modifying the current WK Item Info Injector listener
        wkItemInfoHandler: null,
        // Used for working with the settings dialog and determining which sentences to show (memoized)
        get content() { delete this.content; this.content = {
            keyTitleMap: new Map(), titleKeyMap: new Map(), deckIndex: {}, allContent: new Map(), selections: {}, anime: {}, drama: {}, games: {}, literature: {}, news: {}
        }; return this.content; },
        // Current vocab from wkItemInfo
        item: null,
        // Cached to aid in determining whether retries should be done
        currentUrl: null,
        // Cache for the number of fetches done for any given url
        fetchCount: {},
        // Referenced for quick access to the base node
        baseEl: null,
        // Referenced for quick access to the audio node and also to prevent unnecessary recreation of the element
        audioEls: {},
        // Referenced so that sentences can be re-rendered after settings change
        sentencesEl: null,
        // Reference for quick access to the style sheet
        styleSheetEl: null,
        // Container for other ImmersionKit stuff (memoized)
        get immersionKit() { delete this.immersionKit; this.immersionKit = {
            api: {
                1: {
                    version: 1,
                    origin: 'https://api.immersionkit.com',
                    endpoints: {
                        query: {
                            pathname: '/look_up_dictionary',
                            search(keyword, options) {
                                let {filterExactSearch, exampleLimit, filterJLPTLevel, filterWaniKaniLevel, tags, sentenceSorting} = Object.assign({filterExactSearch:false, exampleLimit:0, filterJLPTLevel:0, filterWaniKaniLevel:false, tags:'', sentenceSorting:'shortness'}, options);
                                keyword = keyword.replace('〜', ''); // for "counter" kanji
                                if (filterExactSearch) keyword = `「${keyword}」`;
                                if (tags?.length > 0) tags = `&tags=${tags}`;
                                switch (sentenceSorting) {
                                    case 'shortness':
                                    case 'longness':
                                        sentenceSorting = `&sort=${sentenceSorting}`;
                                        break;
                                    default:
                                        sentenceSorting = '';
                                }
                                return `?keyword=${keyword}&limit=${exampleLimit}&jlpt=${filterJLPTLevel}&wk=${filterWaniKaniLevel?state.userLevel:0}${tags}${sentenceSorting}`;
                            },
                        },
                    },
                },
                2: {
                    version: 2,
                    origin: 'https://apiv2.immersionkit.com',
                    endpoints: {
                        index: { pathname: '/index_meta' },
                        query: {
                            pathname: '/search',
                            search(keyword, options) {
                                let {filterExactSearch, exampleLimit, filterJLPTLevel, filterWaniKaniLevel, tags, sentenceSorting} = Object.assign({filterExactSearch:false, exampleLimit:0, filterJLPTLevel:0, filterWaniKaniLevel:false, tags:'', sentenceSorting:'sentence_length:asc'}, options);
                                keyword = keyword.replace('〜', ''); // for "counter" kanji
                                if (tags?.length > 0) tags = `&tags=${tags}`;
                                switch (sentenceSorting) {
                                    case 'longness':
                                        sentenceSorting = '&sort=sentence_length:desc';
                                        break;
                                    case 'shortness':
                                        sentenceSorting = '&sort=sentence_length:asc';
                                        break;
                                    default:
                                        sentenceSorting = '';
                                        break;
                                }
                                return `?q=${keyword}&exactMatch=${filterExactSearch?'true':'false'}&limit=${exampleLimit}&jlpt=${filterJLPTLevel}&wk=${filterWaniKaniLevel?state.userLevel:0}${tags}${sentenceSorting}`;
                            },
                        },
                    },
                },
            },
            cache: {
                key: `${scriptId}.immersion-kit-data`,
                // Cached so sentences can be re-rendered after settings change and to persist lookups between sessions
                urls: {},
            },
            baseContentUrl: 'https://us-southeast-1.linodeobjects.com/immersionkit/media/',
        }; return this.immersionKit;},
    };
    const exampleLimitSearchRegex = new RegExp(`(#${scriptId} \\.example:nth-child)(\\(n\\+\\d+\\))?`), // /(#media-context-sentences \.example:nth-child)(\(n\+\d+\))?/
        maxHeightSearchRegex = new RegExp(`(#${scriptId}\\s*{[^}]*?max-height:).*?;`), // /(#media-context-sentences\s*{[^}]*?max-height:) *[\d.] *+\w*;/
        validCssUnitRegex = /^((\d*\.)?\d+)((px)|(em)|(%)|(ex)|(ch)|(rem)|(vw)|(vh)|(vmin)|(vmax)|(cm)|(mm)|(in)|(pt)|(pc))$/i,
        matchAnyUrlRegex = new RegExp(); // default "empty" regex. Equivalent to `/(?:)/`

    Promise.resolve().then(async () => await init());

    async function init() {
        updateKeyMapForTitles();
        const decksIndex = await fetchImmersionKitDecksIndex();
        mergeImmersionKitDeckDataIntoContent(decksIndex);
        if (wkof) {
            await wkof.include('Apiv2,Settings,Menu'); // Apiv2 needed in order to set wkof.user.level
            // document.documentElement.addEventListener('turbo:load', () => setTimeout(() => wkof.ready('Menu').then(installMenu), 0));
            await wkof.ready('Settings');
            // await createContentListsForSettings();
            await migrateSettingsVersion();
            await loadSettings();
            addMissingEntriesToContent();
            await Promise.all([wkof.ready('Apiv2'), addStyle(), onImmersionKitAPIVersionOptionChanged('immersionKitAPIVersion', state.settings.immersionKitAPIVersion)]);
            await restoreCachedImmersionKitData();
            await updateDesiredShows();
            wkof.on_pageload(matchAnyUrlRegex, () => wkof.ready('Menu').then(installMenu));
        } else {
            console.warn(`${scriptName}: You are not using Wanikani Open Framework which this script utilizes to provide the settings dialog for the script. You can still use ${scriptName} normally though`);
            await Promise.all([addStyle(), updateDesiredShows()]);
        }
        window.mediaContextSentences = state;
        setWaniKaniItemInfoListener();
    }

    function setWaniKaniItemInfoListener() {
        if (state.wkItemInfoHandler) // TODO: Consider using two handlers to avoid removing removing the entire handler just for Kanji settings changes
            state.wkItemInfoHandler.remove();
        state.wkItemInfoHandler = wkItemInfo.forType(`${state.settings.showOnKanji ? 'kanji,' : ''}vocabulary,kanaVocabulary`).under('examples').notify(onExamplesVisible);
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // -----------------------------------------------MAIN FUNCTIONALITY----------------------------------------------- //
    // ---------------------------------------------------------------------------------------------------------------- //

    async function addContextSentences() {
        state.baseEl = Object.assign(document.createElement('div'), {id: `${scriptId}-container`});
        state.sentencesEl = Object.assign(document.createElement('div'), {
            id: `${scriptId}`,
            textContent: 'Loading...',
        });

        const titleEl = Object.assign(document.createElement('span'), {textContent: scriptName});
        const header = [], additionalSettings = {sectionName: scriptName, under: 'examples'};
        header.push(titleEl);

        if (wkof) {
            const settingsBtn = Object.assign(document.createElement('span'), {
                textContent: '⚙️',
                className: `${scriptId}-settings-btn`,
                onclick: openSettings,
            });
            header.push(settingsBtn);
        }

        state.baseEl.append(state.sentencesEl);

        if (state.item.injector)
            state.item.injector.appendSubsection(header, state.baseEl, additionalSettings);

        state.currentUrl = getNewImmersionKitUrl(state.item.characters, state.settings);
        const data = await fetchImmersionKitData();
        await renderSentences(data);
    }

    function getNewImmersionKitUrl(keyword, options) {
        const immersionKit = state.immersionKit.api[state.settings.immersionKitAPIVersion],
            endpoint = immersionKit.endpoints.query;
        return `${immersionKit.origin}${endpoint.pathname}${endpoint.search(keyword, options)}`;
    }

    async function restoreCachedImmersionKitData() {if (state.immersionKit.cache.key in wkof.file_cache.dir) state.immersionKit.cache.urls = await wkof.file_cache.load(state.immersionKit.cache.key);}

    async function deleteCachedImmersionKitData() {if (state.immersionKit.cache.key in wkof.file_cache.dir) await wkof.file_cache.delete(state.immersionKit.cache.key);}

    async function saveCachedImmersionKitData() {await wkof.file_cache.save(state.immersionKit.cache.key, state.immersionKit.cache.urls);}

    function mergeImmersionKitDeckDataIntoContent(data) {
        const errorList = [];
        for (let [key, entry] of Object.entries(data)) {
            state.content.deckIndex[key] = entry;
            const {title, category, tags} = entry;
            if (!state.content.keyTitleMap.has(key)) {
                errorList.push({error: 'Key not found in key-title mappings', key});
                state.content.keyTitleMap.set(key, title);
                state.content.titleKeyMap.set(title, key);
            }
            state.content.allContent.set(title, {title, category, tags, enabled: true}); // Default to enabled
            if (category in state.content) {
                state.content[category][title] = title;
            } else {
                errorList.push({error: 'Category not found in state.content', category});
            }
        }
        if (errorList.length > 0) console.warn(`Error(s) during mergeImmersionKitDeckDataIntoContent:`, errorList);
    }

    // Temporary workaround for entries not listed in the index_meta list (likely only matters for API v1)
    function addMissingEntriesToContent() {
        const errorList = [];
        let currentCount = 0;
        for (const category of ['anime', 'drama', 'games', 'literature', 'news']) {
            if (!(category in state.content))
                state.content[category] = {};
            if (Object.keys(state.content[category]).length < Object.keys((state.settings.filters.lists)[category]).length) {
                for (let title of Object.keys((state.settings.filters.lists)[category])) {
                    if (title in state.content[category]) continue;
                    state.content[category][title] = title;
                    state.content.allContent.set(title, {title, category, tags: [], enabled: true});
                    errorList.push(title);
                }
                if (errorList.length > currentCount)
                    sortObjectPropertiesInPlace(state.content[category]);
                currentCount = errorList.length;
            }
        }
        if (state.settings.debugging && errorList.length > 0) {
            console.warn(`Added ${errorList.length} missing entries to content`, errorList);
        }
    }

    // Update the map to be able to look up the title from the key
    function updateKeyMapForTitles() {
        const englishTitles = Object.assign({}, state.settings.filters.lists.anime, state.settings.filters.lists.drama, state.settings.filters.lists.games);
        const japaneseTitles = Object.assign({}, state.settings.filters.lists.literature, state.settings.filters.lists.news);
        for (let title of Object.keys(englishTitles)) {
            const key = normalize(title).toLocaleLowerCase();
            state.content.keyTitleMap.set(key, title);
            state.content.titleKeyMap.set(title, key);
        }
        for (let title of Object.keys(japaneseTitles)) {
            state.content.keyTitleMap.set(title, title);
            state.content.titleKeyMap.set(title, title);
        }
    }

    async function fetchImmersionKitDecksIndex() {
        try {
            const api = state.immersionKit.api[2];
            const url = `${api.origin}${api.endpoints.index.pathname}`;
            let prevModified = state.immersionKit.cache.urls[url]?.lastModified;
            const response = prevModified ? await fetch(url, {headers: {'If-Modified-Since': prevModified}}) : await fetch(url);
            if (response.status === 304)
                return state.immersionKit.cache.urls[url].data; // Return cached data
            const json = await response.json();
            const data = json.data;
            let lastModified = response.headers.get('Last-Modified') || json.lastUpdatedTimestamp;
            if (data != null) {
                if (prevModified !== lastModified) await deleteCachedImmersionKitData();
                for (let key of Object.keys(data).sort()) {
                    const value = data[key];
                    delete data[key];
                    data[key] = value;
                }
            }
            state.immersionKit.cache.urls[url] = {data, lastModified};
            return data;
        } catch(e) {
            throw Error('Error fetching Immersion Kit deck list', {cause: e});
        }
    }

    async function fetchImmersionKitData() {
        const url1 = state.currentUrl ??= getNewImmersionKitUrl(state.item.characters, state.settings);
        const url2 = getNewImmersionKitUrl(state.item.characters, Object.assign({}, state.settings, {filterExactSearch: !state.settings.filters.exactSearch}));
        let url = url1;

        try {
            for (;;) {
                state.fetchCount[url] ??= 0;
                if (state.immersionKit.cache.urls[url1] != null) {
                    const lastModified = state.immersionKit.cache.urls[url1].lastModified;
                    const response = await fetch(url1, {headers: {'If-Modified-Since': lastModified}});
                    if (response.status === 304)
                        return state.immersionKit.cache.urls[url1].data; // Return cached data
                } else if (state.item.type === 'kanji' && state.fetchCount[url1] > 0 && state.immersionKit.cache.urls[url2] != null) {
                    const lastModified = state.immersionKit.cache.urls[url2].lastModified;
                    const response = await fetch(url2, {headers: {'If-Modified-Since': lastModified}});
                    if (response.status === 304)
                        return state.immersionKit.cache.urls[url2].data; // Return cached data
                }
                state.fetchCount[url]++;
                state.sentencesEl.textContent = 'Fetching...';
                if (state.settings.debugging) console.log(`Fetching Immersion Kit data from ${url}`);
                const response = await fetch(url),
                    lastModified = response.headers.get('Last-Modified');
                let data = await response.json();
                if (state.settings.immersionKitAPIVersion === '1')
                    data = data.data[0];
                if (data?.examples?.length > 0) {
                    state.immersionKit.cache.urls[url] = {data, lastModified};
                    await saveCachedImmersionKitData();
                    return data;
                } else if (state.item.type === 'kanji' && !state.fetchCount[url2]) {
                    url = url2;
                    continue;
                } else if (state.fetchCount[url] > state.settings.fetchRetryCount)
                    return data;
                else
                    url = url1;
                const seconds = Math.round(state.settings.fetchRetryDelay / 100) / 10; // round to nearest first decimal
                state.sentencesEl.textContent = `Retrying in ${seconds} second${seconds !== 1 ? 's' : ''}`;
                await sleep(state.settings.fetchRetryDelay);
            }
        } catch(e) {
            throw Error('Error fetching Immersion Kit data', {cause: e});
        }
    }

    async function onExamplesVisible(item) {
        state.item = item; // current vocab item
        try {
            await addContextSentences(item);
        } catch(e) {
            throw Error(`Error while adding ${scriptName} section: ${e.message}`, {cause: e});
        }
    }

    function sortSentences(sentences, primarySorting, secondarySorting) {
        const categoryCompare = (a, b) => a.category.localeCompare(b.category);
        const sourceCompare = (a, b) => a.title.localeCompare(b.title);
        const shortnessCompare = (a, b) => a.sentence.length - b.sentence.length;
        const longnessCompare = (a, b) => b.sentence.length - a.sentence.length;
        const positionCompare = (a, b) => a.furiganaObject.getFirstKeywordIndex() - b.furiganaObject.getFirstKeywordIndex();
        const sort = (primaryOrder, a, b) => {
            if (primaryOrder !== 0) return primaryOrder;
            switch (secondarySorting) {
                case primarySorting:
                    return primaryOrder;
                case 'category':
                    return categoryCompare(a, b);
                case 'source':
                    return sourceCompare(a, b);
                case 'shortness':
                    return shortnessCompare(a, b);
                case 'longness':
                    return longnessCompare(a, b);
                case 'position':
                    return positionCompare(a, b);
                case 'default':
                default:
                    return primaryOrder;
            }
        };
        switch (primarySorting) {
            case 'category':
                sentences.sort((a, b) => sort(categoryCompare(a, b), a, b));
                break;
            case 'longness':
                sentences.sort((a, b) => sort(longnessCompare(a, b), a, b));
                break;
            case 'shortness':
                sentences.sort((a, b) => sort(shortnessCompare(a, b), a, b));
                break;
            case 'source':
                sentences.sort((a, b) => sort(sourceCompare(a, b), a, b));
                break;
            case 'position':
                sentences.sort((a, b) => sort(positionCompare(a, b), a, b));
                break;
            case 'default':
            default:
                break;
        }
    }

    function getItemInfo(item) {
        const allContent = state.content.allContent;
        const keyTitleMap = state.content.keyTitleMap;
        const titleKeyMap = state.content.titleKeyMap;
        let key = null, title = null, category = null;
        switch (state.settings.immersionKitAPIVersion) {
            case '1':
                if (titleKeyMap.has(item.deck_name)) {
                    key = titleKeyMap.get(item.deck_name);
                    title = item.title = item.deck_name;
                    category = item.category;
                } else if (titleKeyMap.has(item.deck_name_japanese)) {
                    key = titleKeyMap.get(item.deck_name_japanese);
                    title = item.title = item.deck_name_japanese;
                    category = item.category;
                } else if (keyTitleMap.has(item.deck_name)) {
                    key = item.deck_name;
                    title = item.title = keyTitleMap.get(item.deck_name);
                    category = item.category;
                } else if (keyTitleMap.has(item.deck_name_japanese)) {
                    key = item.deck_name_japanese;
                    title = item.title = keyTitleMap.get(item.deck_name_japanese);
                    category = item.category;
                } else if (allContent.has(item.deck_name)) {
                    key = item.deck_name;
                    const matchingItem = allContent.get(item.deck_name);
                    title = item.title = matchingItem.title;
                    category = matchingItem.category;
                } else if (allContent.has(item.deck_name_japanese)) {
                    key = item.deck_name_japanese;
                    const matchingItem = allContent.get(item.deck_name_japanese);
                    title = item.title = matchingItem.title;
                    category = matchingItem.category;
                } else {
                    console.warn('No matching title found for item:', item, allContent, keyTitleMap.keys());
                }
                break;
            case '2':
                if (keyTitleMap.has(item.title)) {
                    key = item.title;
                    title = keyTitleMap.get(item.title);
                    category = item.category;
                } else if (titleKeyMap.has(item.title)) {
                    key = titleKeyMap.get(item.title);
                    title = item.title;
                    category = item.category;
                } else if (allContent.has(item.title)) {
                    key = item.title;
                    const matchingItem = allContent.get(item.title);
                    title = matchingItem.title;
                    category = matchingItem.category;
                } else {
                    console.warn('No matching title found for item:', item, allContent, keyTitleMap.keys());
                }
                break;
        }
        return {key, title, category};
    }

    function setKeywordRegexForItem(item, itemKeyword) {
        const keywordSet = new Set(); // use a set to prevent duplicates from being added.
        switch (state.settings.immersionKitAPIVersion) {
            case '1':
                for (let i = 0; i < item.word_index.length; i++)
                    keywordSet.add(item.word_list[item.word_index[i]]);
                break;
            case '2':
                for (let i = 0; i < item.matched_indexes.length; i++)
                    keywordSet.add(item.word_list[item.matched_indexes[i].index]);
                break;
        }
        const sentenceKeywords = Array.from(keywordSet);
        const regexExpression = (sentenceKeywords.length === 0
            // default to the keyword from the item if word_list is empty
            ? itemKeyword.split('').join('\\s*') // intersperse whitespace quantifier to match awkwardly spaced out sentences.
            // use the keywords from the sentence data if they exist properly.
            : sentenceKeywords.join('|')); // use alternation when using the example's word_list (which will end up creating tags around each "word").
        item.furiganaObject.setKeyword(regexExpression);
    }

    async function renderSentences(data) {
        // Called from ImmersionKit response and on settings save
        Object.values(state.audioEls).forEach(el => {el.remove(); el = null;});
        state.audioEls = {};
        if (data == null)
            return state.sentencesEl.textContent = 'Error fetching examples from Immersion Kit.';
        const exampleCount = data.examples?.length ?? 0;
        if (exampleCount === 0)
            return state.sentencesEl.textContent = `${state.settings.fetchRetryCount > 0 ? 'Retry limit reached. ' : ''}No sentences found.`;
        state.sentencesEl.textContent = 'Loading...';
        const debugList = new Map();
        const errorList = [];
        const sentencesToDisplay = [];
        // Exclude non-selected titles
        for (let i = 0; i < exampleCount; i++) {
            const example = data.examples[i];
            const {title} = getItemInfo(example);
            if (!title || !state.content.allContent.has(title)) {
                const error = !title ? 'No title' : `No matching title found for "${title}"`;
                errorList.push({error, index: `${i + 1} of ${exampleCount}:`, example});
                continue;
            }
            const matchingEntry = state.content.allContent.get(title);
            const enabled = matchingEntry?.enabled ?? false;
            if (!enabled) {
                if (state.settings.debugging) debugList.set(title, (debugList.get(title) ?? 0) + 1);
                continue;
            }
            example.category = matchingEntry.category;
            const baseUrl = `${state.immersionKit.baseContentUrl}${matchingEntry.category}/${matchingEntry.title}/media/`;
            // Normalize or create image and sound URLs
            example.image_url = example.image_url || `${baseUrl}${example.image}`;
            example.sound_url = example.sound_url || `${baseUrl}${example.sound}`;
            // Strip directional formatting and other non-displaying characters from sentences (...how they got there in the first place, who knows...)
            const directionalFormattingCharsRegex = /[\u202A-\u202E\u2066-\u2069\uE4C6]/g;
            example.sentence = example.sentence.replace(directionalFormattingCharsRegex,'');
            example.sentence_with_furigana = example.sentence_with_furigana.replace(directionalFormattingCharsRegex,'');
            example.furiganaObject = new Furigana(example.sentence, example.sentence_with_furigana);
            const itemKeyword = state.item.characters.replace('〜', '');
            if (state.settings.filters.exactMatch && !example.sentence.includes(itemKeyword)) {
                if (state.settings.debugging) debugList.set(title, (debugList.get(title) ?? 0) + 1);
                // if (state.settings.debugging) console.log(`Excluded: Title="${title}"; ExactMatch=true`);
                continue;
            }
            setKeywordRegexForItem(example, itemKeyword);
            sentencesToDisplay.push(example);
        }
        if (errorList.length > 0) console.warn(`Error(s) found while rendering sentences:`, errorList);
        if (state.settings.debugging && debugList.size > 0)
            console.log('Currently hidden titles:', debugList);
        if (sentencesToDisplay.length === 0 || state.settings.failWhenHidden && debugList.size > 0) {
            const deckCountsAsJson = JSON.stringify(data.deck_count, undefined, '\t');
            const preElement = Object.assign(document.createElement('pre'), {
                innerHTML: `${sentencesToDisplay.length>0 ? sentencesToDisplay.length : 'No'} sentences found for the selected filters (${exampleCount-sentencesToDisplay.length} are available but hidden; see below for details and entry counts).`,
            });
            if (state.settings.failWhenHidden)
                preElement.innerHTML += `<br><br>Currently hidden titles: {<br>\t${Array.from(debugList).map(([title, count]) => `"${title}": ${count}`).join('<br>\t')}<br>}<br>`;
            preElement.innerHTML += `<br>Complete deck count data: ${deckCountsAsJson}`
            state.sentencesEl.replaceChildren(preElement);
            return;
        }

        const fragment = document.createDocumentFragment();
        sortSentences(sentencesToDisplay, state.settings.sentenceSorting, state.settings.sentenceSortingSecondary);
        for (let i = 0; i < sentencesToDisplay.length; i++) {
            const example = sentencesToDisplay[i];
            const exampleElement = await createExampleElement(example);
            fragment.appendChild(exampleElement);
        }
        state.sentencesEl.replaceChildren(fragment);
    }

    async function createExampleElement(example) {
        const {title} = getItemInfo(example);
        const parentEl = Object.assign(document.createElement('div'), {className: 'example'}),
            imgEl = Object.assign(document.createElement('img'), {
                src: example.image_url ?? '',
                decoding: 'auto',
                alt: '',
            }),
            textParentEl = Object.assign(document.createElement('div'), {className: 'example-text'}),
            textTitleEl = Object.assign(document.createElement('div'), {
                className: 'title',
                title: example.id, // TODO: Consider removing/moving elsewhere
                textContent: state.content.allContent.get(title).title,
            }),
            audioButtonEl = Object.assign(document.createElement('button'), {
                type: 'button',
                className: 'audio-btn audio-idle',
                title: 'Play Audio',
                textContent: '🔈',
            }),
            jaEl = Object.assign(document.createElement('div'), {className: 'ja'}),
            jaFuriganaSpanEl = Object.assign(document.createElement('span'), {
                className: 'furigana',
                innerHTML: example.furiganaObject.getFuriganaHtml(),
            }),
            enEl = Object.assign(document.createElement('div'), {className: 'en'}),
            enSpanEl = Object.assign(document.createElement('span'), {textContent: example.translation}),
            elements = [
                {element: jaFuriganaSpanEl,
                    classListUpdates: [{name: 'showJapanese', value: state.settings.showJapanese}, {name: 'showFurigana', value: state.settings.showFurigana}],
                    clickListener: {name: 'showFurigana', value: state.settings.showFurigana}},
                {element: enSpanEl,
                    classListUpdates: [{name: 'showEnglish', value: state.settings.showEnglish}],
                    clickListener: {name: 'showEnglish', value: state.settings.showEnglish}},
            ],
            promises = [];
        for (const {element, classListUpdates, clickListener} of elements) {
            for (const {name, value} of classListUpdates)
                promises.push(updateClassListForSpanElement(element, name, value));
            const {name, value} = clickListener;
            promises.push(updateOnClickListenerForSpanElement(element, name, value));
        }
        await Promise.all(promises);

        attachAudioOnClickListener(parentEl);
        configureAudioElement(audioButtonEl, example);
        parentEl.append(imgEl);
        textTitleEl.append(audioButtonEl);
        textParentEl.append(textTitleEl);

        jaEl.append(jaFuriganaSpanEl);
        enEl.append(enSpanEl);
        textParentEl.append(jaEl);
        textParentEl.append(enEl);

        parentEl.append(textParentEl);
        return parentEl;
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // ----------------------------------------------------HELPERS----------------------------------------------------- //
    // ---------------------------------------------------------------------------------------------------------------- //

    function sortObjectPropertiesInPlace(obj) {
        if (typeof obj !== 'object') return;
        Object.keys(obj).sort().forEach(function(key) {
            const value = obj[key];
            delete obj[key];
            obj[key] = value;
        });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function normalize(str){return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll('×','x').replace(/[^a-z0-9]/gi,'_');} // .replace(/[\s,“”"`'.?!;:()[\]{}\-−/+*=&]/g, '_');}

    // Adapted from WKOF Core.js
    // If `currentVersion` is newer than otherVersion, return 1; if `currentVersion` is older than otherVersion, return -1; otherwise, return 0
    function compareVersions(currentVersion, otherVersion) {
        const currentVer = currentVersion?.split('.').map(d => Number(d)) || [];
        const otherVer = otherVersion?.split('.').map(d => Number(d)) || [];
        const len = Math.max(currentVer.length, otherVer.length);
        for (let idx = 0; idx < len; idx++) {
            const v1 = currentVer[idx] || 0;
            const v2 = otherVer[idx] || 0;
            if (v1 !== v2) return v1 - v2;
        }
        return 0;
    }

    function isEmptyObject(value) {
        if (value == null || typeof value !== 'object') return false;
        const proto = Object.getPrototypeOf(value);
        // consider `Object.create(null)`, commonly used as a safe map
        // before `Map` support, an empty object as well as `{}`
        if (proto !== null && proto !== Object.prototype)
            return false;
        for (const prop in value)
            if (Object.hasOwn(value, prop))
                return false;
        return true;
    }

    function arrayValuesEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        let aValues = Object.values(a), bValues = Object.values(b);
        if (aValues.length !== bValues.length) return false;
        for (let i = 0; i < aValues.length; ++i) {
            if (aValues[i] !== bValues[i]) return false;
        }
        return true;
    }

    function updateObjectValuesToValuesFromOtherObjects(object, ...otherObjects) {
        const keys = Object.keys(object);
        for (let i = 0; i < otherObjects.length; i++){
            const obj = otherObjects[i];
            const values = Array.isArray(obj) ? obj : Object.values(obj);
            for (let j = 0; j < keys.length && j < values.length; j++) {
                object[keys[j]] = values[j];
            }
        }
        return object;
    }

    async function setObjectEntriesEqualToOtherObjectKeys(outputObject, object) {
        const keys = Object.keys(object);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            outputObject[key] = key;
        }
    }

    // ----------------------------------------------ELEMENT MANIPULATION---------------------------------------------- //

    function configureAudioElement(element, example) {
        const idleClassName = 'audio-idle',
            playingClassName = 'audio-play',
            onPlay = (event) => {
                for (const [key, el] of Object.entries(state.audioEls)) {
                    if (key !== example.id && !el.paused) el.pause();
                    if (state.settings.restartAudioOnPause) el.currentTime = 0;
                }
                element.classList.replace(idleClassName, playingClassName);
                element.textContent = '🔊';
            }, onStop = (event) => {
                element.classList.replace(playingClassName, idleClassName);
                element.textContent = '🔈';
                removeAudioElement(event.currentTarget);
            };
        element.addEventListener('click', function(e) {
            e.stopPropagation(); // prevent this click from triggering twice in some scenarios
            const audioEl = state.audioEls[example.id] = (state.audioEls[example.id] || Object.assign(document.createElement('audio'), {
                src: example.sound_url,
                playbackRate: state.settings.playbackRate * 2 / 100,
                volume: state.settings.playbackVolume / 100,
                onplay: onPlay,
                onpause: onStop,
                onended: onStop,
                onabort: onStop,
            }));
            if (!audioEl.paused) {
                audioEl.pause();
                return;
            }
            state.baseEl.append(audioEl);
            audioEl.play()?.catch(() => {});
        }, {passive: true});
    }

    function removeAudioElement(element) {
        if (element == null) return;
        // element.src = '';
        // element.removeAttribute('src');
        element.remove();
    }

    async function updateClassListForSpanElement(element, name, value) {
        switch (name) {
            case 'showEnglish':
            case 'showJapanese':
                element.classList.toggle('show-on-click', value === 'onclick');
                element.classList.toggle('show-on-hover', value === 'onhover');
                break;
            case 'showFurigana':
                if (element.classList.contains('base')) {
                    element.classList.toggle('hidden', value !== 'never');
                } else if (element.classList.contains('furigana')) {
                    element.classList.toggle('show-ruby-on-hover', value === 'onhover');
                    element.classList.toggle('hide-ruby', value === 'never');
                }
                break;
        }
    }

    // ----------------------------------------------------ON CLICK---------------------------------------------------- //

    async function updateOnClickListenerForSpanElement(element, name, value) {
        switch (value) {
            case 'always':
            case 'onhover':
            case 'never':
                if (name !== 'showFurigana') removeOnClickEventListener(element);
                break;
            case 'onclick':
                attachShowOnClickEventListener(element);
                break;
            default:
                return;
        }
    }

    function onAudioElementClick(event) {
        if (event.target.classList.contains('show-on-click')) return;
        const button = event.currentTarget.querySelector('.audio-btn');
        button?.click();
    }

    function attachAudioOnClickListener(element) {
        // Click anywhere plays the audio
        element.addEventListener('click', onAudioElementClick, {passive: true});
    }

    function onShowOnClick(event) {
        event.stopPropagation(); // prevent this click from triggering the audio to play
        event.target.classList.toggle('show-on-click');
    }

    function attachShowOnClickEventListener(element) {
        // Assign an onclick function to toggle the .show-on-click class
        element.addEventListener('click', onShowOnClick, {passive: true});
    }

    function removeOnClickEventListener(element) {
        element.removeEventListener('click', onShowOnClick, {passive: true});
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // ----------------------------------------------------SETTINGS---------------------------------------------------- //
    // ---------------------------------------------------------------------------------------------------------------- //

    /** Installs the `options` button in the menu */
    function installMenu() {
        const config = {
            name: scriptId,
            submenu: 'Settings',
            title: scriptName,
            on_click: openSettings,
        };
        wkof.Menu.insert_script_link(config);
    }

    async function loadSettings() {
        try {
            return mergeSettings(await wkof.Settings.load(scriptId, state.settings));
        } catch(e) {
            throw Error('Error loading settings from WaniKani Open Framework', {cause: e});
        }
    }

    function mergeSettings(settings) {
        // need to use Object.assign() in order to avoid updating the state.settings object byref whenever it is saved
        return Object.assign(state.settings, structuredClone(settings));
    }

    // Deletes settings when the current version is older than the last major update
    async function migrateSettingsVersion() {
        const majorUpdateVersion = '4.0.0';
        if (compareVersions(state.settings.version, majorUpdateVersion) >= 0) return;
        const settingsKey = `wkof.settings.${scriptId}`;
        await wkof.file_cache.delete(settingsKey);
        await loadSettings();
        wkof.settings[scriptId].version = scriptVersion;
        try {
            await wkof.Settings.save(scriptId);
        } catch (e) {
            throw Error('Error migrating old settings from WaniKani Open Framework', {cause: e});
        }
    }

    // Called when the user clicks the Save button on the Settings dialog.
    async function onSettingsSaved(updatedSettings) {
        let shouldRerender = false, shouldUpdateShows = false;
        const {
            filters: {
                exactMatch: filterExactMatch,
                exactSearch: filterExactSearch,
                jLPTLevel: filterJLPTLevel,
                waniKaniLevel: filterWaniKaniLevel,
                lists: {
                    anime: filterAnime, drama: filterDrama, games: filterGames, literature: filterLiterature, news: filterNews}
            },
            immersionKitAPIVersion,
            sentenceSorting,
            sentenceSortingSecondary,
            // debugging, // changes handled in onSettingsClosed
            // restartAudioOnPause, // changes handled in onSettingsClosed
            // failWhenHidden, // changes handled in onSettingsClosed
            // highlighting, // Not implemented (TODO)
            // exampleLimit, // changes handled in onSettingsClosed
            // fetchRetryCount, // changes handled in onSettingsClosed
            // fetchRetryDelay, // changes handled in onSettingsClosed
            // maxBoxHeight, // changes handled in onSettingsClosed
            // playbackRate, // changes handled in onSettingsClosed
            // playbackVolume, // changes handled in onSettingsClosed
            // showEnglish, // changes handled in onSettingsClosed
            // showFurigana, // changes handled in onSettingsClosed
            // showJapanese, // changes handled in onSettingsClosed
            // showOnKanji, // changes handled in onSettingsClosed
        } = state.settings;
        const {
            highlighting: highlightingNew, // Not implemented
            filters: {
                exactMatch: filterExactMatchNew,
                exactSearch: filterExactSearchNew,
                jLPTLevel: filterJLPTLevelNew,
                waniKaniLevel: filterWaniKaniLevelNew,
                lists: {anime: filterAnimeNew, drama: filterDramaNew, games: filterGamesNew, literature: filterLiteratureNew, news: filterNewsNew}
            },
            immersionKitAPIVersion: immersionKitAPIVersionNew,
            sentenceSorting: sentenceSortingNew,
            sentenceSortingSecondary: sentenceSortingSecondaryNew,
        } = updatedSettings;

        const filterMediaList = Object.assign({}, filterAnime, filterDrama, filterGames, filterLiterature, filterNews);
        const filterMediaListNew = Object.assign({}, filterAnimeNew, filterDramaNew, filterGamesNew, filterLiteratureNew, filterNewsNew);
        const filterListsDiffer = !arrayValuesEqual(filterMediaList, filterMediaListNew);

        // avoid many issues by updating the values manually exactly as desired
        Object.assign(state.settings.filters.lists.anime, filterAnimeNew); // Use Object.assign() to allow persisting old values
        Object.assign(state.settings.filters.lists.drama, filterDramaNew);
        Object.assign(state.settings.filters.lists.games, filterGamesNew);
        Object.assign(state.settings.filters.lists.literature, filterLiteratureNew);
        Object.assign(state.settings.filters.lists.news, filterNewsNew);
        state.settings.filters.exactMatch = filterExactMatchNew;
        state.settings.filters.exactSearch = filterExactSearchNew;
        state.settings.filters.jLPTLevel = filterJLPTLevelNew;
        state.settings.filters.waniKaniLevel = filterWaniKaniLevelNew;
        state.settings.sentenceSorting = sentenceSortingNew;
        state.settings.sentenceSortingSecondary = sentenceSortingSecondaryNew;
        state.settings.highlighting = highlightingNew;
        state.settings.immersionKitAPIVersion = immersionKitAPIVersionNew;

        // if (showOnKanji !== showOnKanjiNew) setWaniKaniItemInfoListener(showOnKanjiNew);
        if (filterExactSearchNew !== filterExactSearch || filterJLPTLevel !== filterJLPTLevelNew || filterWaniKaniLevel !== filterWaniKaniLevelNew) {
            // Immersion Kit search options changed
            state.currentUrl = getNewImmersionKitUrl(state.item.characters, updatedSettings);
            shouldRerender = true;
        }
        if (immersionKitAPIVersion !== immersionKitAPIVersionNew) {
            await onImmersionKitAPIVersionOptionChanged('immersionKitAPIVersion', immersionKitAPIVersionNew);
            state.currentUrl = getNewImmersionKitUrl(state.item.characters, updatedSettings);
            shouldUpdateShows = true;
            shouldRerender = true;
        } else if (filterListsDiffer) {
            shouldUpdateShows = true;
            shouldRerender = true;
        } else if (filterExactMatch !== filterExactMatchNew || sentenceSorting !== sentenceSortingNew || sentenceSortingSecondary !== sentenceSortingSecondaryNew) {
            shouldRerender = true;
        }

        if (shouldUpdateShows)
            await updateDesiredShows();
        if (shouldRerender) {
            const data = await fetchImmersionKitData();
            await renderSentences(data);
        }
    }

    function onPrimarySortOptionChanged(name, value) {
        // TODO: This method is a somewhat cursed way of handling this and should be replaced by a natively available method via WKOF if/when I can figure one out.
        const options = document.getElementById(`${scriptId}_sentenceSortingSecondary`)?.options;
        if (options === null) return;
        const keysToHide = state.options.secondarySortingMethodsToHide(value);
        for (let i = 0; i < options.length; i++) {
            const option = options[i], optionName = option.getAttribute('name');
            const shouldHide = keysToHide.includes(optionName);
            option.classList.toggle('hidden', shouldHide);
            if (options.selectedIndex === i && shouldHide)
                options.selectedIndex = 0;
        }
    }

    function openSettings(e) {
        e.stopPropagation();

        const settingsConfig = {
            script_id: scriptId, title: scriptName, on_save: onSettingsSaved, on_close: onSettingsClosed,
            content: {
                general: {
                    type: 'page', label: 'General', content: {
                        generalDescription: {
                            type: 'section', label: 'Changes to settings in this tab can be previewed in real-time.',
                        }, appearanceOptions: {
                            type: 'group', label: 'Appearance Options', content: {
                                showOnKanji: {
                                    type: 'checkbox', label: 'Show on Kanji Items',
                                    default: state.settings.showOnKanji,
                                    hover_tip: 'Allows the box to appear in the Examples tab for kanji in addition to vocabulary.',
                                    on_change: onShowOnKanjiOptionChanged,
                                }, maxBoxHeight: {
                                    type: 'text', label: 'Box Height', step: 1, min: 0,
                                    default: state.settings.maxBoxHeight,
                                    hover_tip: 'Set the maximum height of the container box.\nIf no unit type is provided, px (pixels) is automatically appended.',
                                    on_change: onMaxBoxHeightOptionChanged, validate: validateMaxHeight,
                                }, exampleLimit: {
                                    type: 'number', label: 'Example Limit', step: 1, min: 0,
                                    default: state.settings.exampleLimit,
                                    hover_tip: 'Limit the number of entries that may appear.\nSet to 0 to show as many as possible (note that this can really lag the list generation when there are a very large number of matches).',
                                    on_change: onExampleLimitOptionChanged,
                                }, showJapanese: {
                                    type: 'dropdown', label: 'Show Japanese',
                                    default: state.settings.showJapanese,
                                    content: state.options.showText,
                                    hover_tip: 'When to show Japanese text.\nHover enables transcribing a sentences first (play audio by clicking the image to avoid seeing the answer).',
                                    on_change: onTextShowOptionChanged,
                                }, showFurigana: {
                                    type: 'dropdown', label: 'Show Furigana',
                                    default: state.settings.showFurigana,
                                    content: state.options.showFurigana,
                                    hover_tip: 'These have been autogenerated so there may be mistakes.',
                                    on_change: onTextShowOptionChanged,
                                }, showEnglish: {
                                    type: 'dropdown', label: 'Show English',
                                    default: state.settings.showEnglish,
                                    content: state.options.showText,
                                    hover_tip: 'Hover or click allows testing your understanding before seeing the answer.',
                                    on_change: onTextShowOptionChanged,
                                },
                            },
                        }, playbackOptions: {
                            type: 'group', label: 'Playback Options', content: {
                                playbackRate: {
                                    type: 'input', subtype: 'range', label: 'Playback Speed',
                                    default: state.settings.playbackRate,
                                    hover_tip: 'Speed to play back audio. (10% - 200%)',
                                    on_change: onAudioPlaybackOptionChanged, validate: validatePlaybackRate,
                                }, playbackVolume: {
                                    type: 'input', subtype: 'range', label: 'Playback Volume',
                                    default: state.settings.playbackVolume,
                                    hover_tip: 'Volume to play back audio. (0% - 100%)',
                                    on_change: onAudioPlaybackOptionChanged, validate: validatePlaybackVolume,
                                }, restartAudioOnPause: {
                                    type: 'checkbox', label: 'Restart Audio on Pause',
                                    default: state.settings.restartAudioOnPause,
                                    hover_tip: 'If true, will restart the audio track from the beginning when the user pauses.\nIf false, will save the current position and resume from there the next time that sentence is played.',
                                    on_change: onToggleOptionChanged,
                                }

                            },
                        }, immersionKitDataFetchingOptions: {
                            type: 'group', label: 'Immersion Kit Data Fetching Options', content: {
                                fetchRetryCount: {
                                    type: 'number', label: 'Fetch Retry Count', step: 1, min: 0,
                                    default: state.settings.fetchRetryCount,
                                    hover_tip: 'Set how many times you would like to allow retrying the fetch for sentences (to workaround backend issues).',
                                    on_change: onFetchOptionChanged,
                                }, fetchRetryDelay: {
                                    type: 'number', label: 'Fetch Retry Delay (ms)', step: 1, min: 0,
                                    default: state.settings.fetchRetryDelay,
                                    hover_tip: 'Set the delay in milliseconds between each retry attempt.',
                                    on_change: onFetchOptionChanged,
                                },
                            },
                        }, advancedOptions: {
                            type: 'group', label: 'Advanced Options', content: {
                                debugging: {
                                    type: 'checkbox', label: 'Debugging',
                                    default: state.settings.debugging,
                                    hover_tip: 'Show additional debugging information in the console.',
                                    on_change: onToggleOptionChanged,
                                },
                                failWhenHidden: {
                                    type: 'checkbox', label: 'Fail When Hidden',
                                    default: state.settings.failWhenHidden,
                                    hover_tip: 'Immediately fail to display the sentences if any are available but hidden, instead showing a message including the list of hidden sentences.\nNote: Toggling this option will immediately cause a rerender of the sentences.',
                                    on_change: onToggleOptionChanged,
                                },
                            },
                        },
                    },
                }, sorting: {
                    type: 'page', label: 'Sorting', content: {
                        sentenceSortOptions: {
                            type: 'group', label: 'Sentence Sorting Options', content: {
                                sentenceSorting: {
                                    type: 'dropdown', label: 'Primary Sorting Method',
                                    default: state.settings.sentenceSorting,
                                    content: state.options.sortingMethods,
                                    hover_tip: 'Choose in what order the sentences will be presented.\nDefault = Exactly as retrieved from Immersion Kit',
                                    on_change: onPrimarySortOptionChanged,
                                }, sentenceSortingSecondary: {
                                    type: 'dropdown', label: 'Secondary Sorting Method',
                                    default: state.settings.sentenceSortingSecondary,
                                    content: state.options.secondarySortingMethods(state.settings.sentenceSorting),
                                    hover_tip: 'Choose how you would like to sort equivalencies in the primary sorting method.\nDefault = No secondary sorting',
                                },
                            },
                        },
                    },
                }, filters: {
                    type: 'page', label: 'Filters', content: {
                        sentenceFilteringOptions: {
                            type: 'group', label: 'Sentence Filtering Options', content: {
                                filterExactMatch: {
                                    type: 'checkbox', label: 'Exact Match',
                                    default: state.settings.filters.exactMatch,
                                    hover_tip: 'Text must match term exactly, i.e., this filters out conjugations/inflections.\nChecking this for a word with kanji means it will not match if the sentence has it only in kana form and vice-versa for kana-only vocabulary.\n\nThis filtering is done after the results are retrieved from Immersion Kit and may yield different results than the "Exact Search" option (below) when the latter is not used.',
                                    path: '@filters.exactMatch',
                                }, filterAnime: {
                                    type: 'list', label: 'Anime', multi: true,
                                    size: 10,
                                    default: state.content.selections.anime,
                                    content: state.content.anime,
                                    hover_tip: 'Select the anime that can be included in the examples.',
                                    path: '@filters.lists.anime',
                                }, filterDrama: {
                                    type: 'list', label: 'Drama', multi: true,
                                    size: 6,
                                    default: state.content.selections.drama,
                                    content: state.content.drama,
                                    hover_tip: 'Select the dramas that can be included in the examples.',
                                    path: '@filters.lists.drama',
                                }, filterGames: {
                                    type: 'list', label: 'Games', multi: true,
                                    size: 3,
                                    default: state.content.selections.games,
                                    content: state.content.games,
                                    hover_tip: 'Select the video games that can be included in the examples.',
                                    path: '@filters.lists.games',
                                }, filterLiterature: {
                                    type: 'list', label: 'Literature', multi: true,
                                    size: 6,
                                    default: state.content.selections.literature,
                                    content: state.content.literature,
                                    hover_tip: 'Select the pieces of literature that can be included in the examples.',
                                    path: '@filters.lists.literature',
                                }, filterNews: {
                                    type: 'list', label: 'News', multi: true,
                                    size: 6,
                                    default: state.content.selections.news,
                                    content: state.content.news,
                                    hover_tip: 'Select the news sources that can be included in the examples.',
                                    path: '@filters.lists.news',
                                },
                            },
                        }, immersionKitSearchOptions: {
                            type: 'group', label: 'Immersion Kit Search Options', content: {
                                immersionKitSearchDescription: {
                                    type: 'section', label: 'Changes here cause an API request unless already cached.',
                                }, filterExactSearch: {
                                    type: 'checkbox', label: 'Exact Search',
                                    default: state.settings.filters.exactSearch,
                                    hover_tip: 'Text must match term exactly, i.e., this filters out conjugations/inflections.\nChecking this for a word with kanji means it will not match if the sentence has it only in kana form and vice-versa for kana-only vocabulary.',
                                    path: '@filters.exactSearch',
                                }, filterWaniKaniLevel: {
                                    type: 'checkbox', label: 'WaniKani Level',
                                    default: state.settings.filters.waniKaniLevel,
                                    hover_tip: 'Only show sentences with maximum 1 word outside of your current WaniKani level.',
                                    path: '@filters.waniKaniLevel',
                                }, filterJLPTLevel: {
                                    type: 'dropdown', label: 'JLPT Level',
                                    default: state.settings.filters.jLPTLevel,
                                    content: state.options.jlpt,
                                    hover_tip: 'Only show sentences matching a particular JLPT Level or easier.',
                                    path: '@filters.jLPTLevel',
                                }, immersionKitAPIVersion: {
                                    type: 'dropdown', label: 'Immersion Kit API Version',
                                    default: state.settings.immersionKitAPIVersion,
                                    content: state.options.immersionKitAPIVersion,
                                    hover_tip: 'Select the Immersion Kit API version to use.',
                                },
                            },
                        },
                    },
                }, credits: {
                    type: 'html', label: 'Powered by', html: '<a href="https://www.immersionkit.com" style="vertical-align:middle;vertical-align:-webkit-baseline-middle;vertical-align:-moz-middle-with-baseline;">https://www.immersionkit.com</a>',
                },
            },
        };
        const dialog = new wkof.Settings(settingsConfig);
        dialog.open();
    }

    async function onAudioPlaybackOptionChanged(name, value) {
        const audioContainer = state.baseEl?.querySelector('audio');
        if (audioContainer === null) return;
        switch (name) {
            case 'playbackRate':
                if (value === state.settings.playbackRate) return;
                state.settings.playbackRate = value;
                audioContainer.playbackRate = value * 2 / 100;
                break;
            case 'playbackVolume':
                if (value === state.settings.playbackVolume) return;
                state.settings.playbackVolume = value;
                audioContainer.volume = value / 100;
                break;
        }
    }

    async function onExampleLimitOptionChanged(name, value) {
        if (value === state.settings[name]) return;
        // Adjust the example limit with CSS to avoid recreating the list
        const replacement = value===0 ? '$1' : `$1(n+${value+1})`;
        state.settings.exampleLimit = value;
        state.styleSheetEl.innerHTML = state.styleSheetEl.innerHTML.replace(exampleLimitSearchRegex,replacement);
    }

    async function onFetchOptionChanged(name, value) {
        let prevRetryCount;
        switch (name) {
            case 'fetchRetryCount':
                // TODO: Possibly make this not affect the fetch count when the dialog was canceled instead of saved
                if (value === state.settings.fetchRetryCount) return;
                prevRetryCount = state.settings.fetchRetryCount;
                state.settings.fetchRetryCount = value;
                if (state.sentencesEl.childElementCount === 0 && value > prevRetryCount && value >= (state.fetchCount[state.currentUrl] ?? 0)) {
                    const data = await fetchImmersionKitData();
                    await renderSentences(data);
                }
                break;
            case 'fetchRetryDelay':
                if (value === state.settings.fetchRetryDelay) return;
                state.settings.fetchRetryDelay = value;
                break;
        }
    }

    async function onToggleOptionChanged(name, value) {
        if (value === state.settings[name]) return;
        state.settings[name] = value;
        switch (name) {
            case 'debugging':
                break;
            case 'failWhenHidden':
                const data = await fetchImmersionKitData();
                await renderSentences(data);
                break;
            case 'restartAudioOnPause':
                break;
        }
    }

    async function onImmersionKitAPIVersionOptionChanged(name, value) {
        // if (value === state.settings[name]) return;
        // state.settings[name] = value;
        let title;
        switch (value) {
            case '1':
                for (const title of ['Good Morning Call Season 1', 'Good Morning Call Season 2'])
                    state.content.drama[title] = title;
                title = 'Good Morning Call';
                if (title in state.content.drama)
                    delete state.content.drama[title];
                sortObjectPropertiesInPlace(state.settings.filters.lists.drama);
                sortObjectPropertiesInPlace(state.content.drama);
                break;
            case '2':
                for (const title of ['Good Morning Call Season 1', 'Good Morning Call Season 2']) {
                    if (!(title in state.content.drama)) continue;
                    delete state.content.drama[title];
                }
                title = 'Good Morning Call';
                state.content.drama[title] = title;
                sortObjectPropertiesInPlace(state.content.drama);
                break;
            default:
                return;
        }
        updateKeyMapForTitles();
    }

    async function onMaxBoxHeightOptionChanged(name, value) {
        if (value === state.settings[name]) return;
        if (!Number.isNaN(Number(value))) {
            value += 'px';
            state.settings.maxBoxHeight = wkof.settings[scriptId].maxBoxHeight = value;
        }
        const replacement = `$1 ${value};`;
        state.styleSheetEl.innerHTML = state.styleSheetEl.innerHTML.replace(maxHeightSearchRegex,replacement);
    }

    async function onShowOnKanjiOptionChanged(name, value) {
        if (value === state.settings[name]) return;
        state.settings.showOnKanji = value;
        setWaniKaniItemInfoListener();
    }

    async function onSettingsClosed(settings) {
        // Revert any modifications that were unsaved or finalize any that were.
        await Promise.all([
            onShowOnKanjiOptionChanged('showOnKanji', settings.showOnKanji),
            onAudioPlaybackOptionChanged('playbackRate', settings.playbackRate),
            onAudioPlaybackOptionChanged('playbackVolume', settings.playbackVolume),
            onExampleLimitOptionChanged('exampleLimit', settings.exampleLimit),
            onFetchOptionChanged('fetchRetryCount', settings.fetchRetryCount),
            onFetchOptionChanged('fetchRetryDelay', settings.fetchRetryDelay),
            onMaxBoxHeightOptionChanged('maxBoxHeight', settings.maxBoxHeight),
            onTextShowOptionChanged('showJapanese', settings.showJapanese),
            onTextShowOptionChanged('showFurigana', settings.showFurigana),
            onTextShowOptionChanged('showEnglish', settings.showEnglish),
            onToggleOptionChanged('debugging', settings.debugging),
            onToggleOptionChanged('failWhenHidden', settings.failWhenHidden),
            onToggleOptionChanged('restartAudioOnPause', settings.restartAudioOnPause),
        ]);
    }

    async function onTextShowOptionChanged(name, value) {
        let selector;
        switch (name) {
            case 'showEnglish':
                if (value === state.settings.showEnglish) return;
                state.settings.showEnglish = value;
                selector = '.example-text .en > span';
                break;
            case 'showFurigana':
                if (value === state.settings.showFurigana) return;
                state.settings.showFurigana = value;
            // fallthrough
            case 'showJapanese':
                if (value === state.settings.showJapanese) return;
                state.settings.showJapanese = value;
                selector = '.example-text .ja > span';
                break;
            default:
                return;
        }
        const exampleEls = state.sentencesEl.querySelectorAll(selector);
        const promises = [];
        for (let i = 0; i < exampleEls.length; i++) {
            const el = exampleEls[i];
            promises.push(updateClassListForSpanElement(el, name, value));
            promises.push(updateOnClickListenerForSpanElement(el, name, value));
        }
        await Promise.all(promises);
    }

    async function updateDesiredShows() {
        // Combine settings objects to a single set containing the desired titles
        const errors = [];
        for (const [category, values] of Object.entries(state.settings.filters.lists)) {
            for (const [title, value] of Object.entries(values)) {
                // Always use the full title as the key
                let entry = {category, enabled: value, tags: [], title};
                if (state.content.allContent.has(title)) {
                    // Push the settings value to the corresponding entry in the content object
                    entry = state.content.allContent.get(title);
                    entry.enabled = value;
                    // Update the selection set for the settings dialog
                    if (!state.content.selections[entry.category]) state.content.selections[entry.category] = {};
                    state.content.selections[entry.category][title] = value;
                } else if (typeof value === 'boolean') {
                    errors.push(Object.assign({error: `"title" from "settings.filters.lists.${category}" not found in "allContent"`}, entry));
                } else {
                    state.content.allContent.set(title, entry);
                    errors.push(Object.assign({error: 'Unresolved Error. Added "title" to "allContent"'}, entry));
                }
            }
        }
        if (errors.length > 0)
            console.debug(`Error(s) found during updateDesiredShows:`, errors);
    }

    function validateMaxHeight(value) {
        return value === undefined || value === null || value === '' || validCssUnitRegex.test(value) || 'Number and (optional) valid unit type only';
    }

    function validatePlaybackRate(value) {
        return {valid: value >= 5, msg: `${value * 2}%`};
    }

    function validatePlaybackVolume(value) {
        return {valid: true, msg: `${value}%`};
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // -----------------------------------------------------STYLES----------------------------------------------------- //
    // ---------------------------------------------------------------------------------------------------------------- //

    async function addStyle() {
        if (document.getElementById(styleSheetName)) return;
        state.styleSheetEl = Object.assign(document.createElement('style'), {
            id: styleSheetName,
            type: 'text/css',
            // language=CSS
            textContent: `
            #${scriptId} { max-height: ${state.settings.maxBoxHeight}; overflow-y: auto; }
            #${scriptId} .example:nth-child${state.settings.exampleLimit===0?'':`(n+${state.settings.exampleLimit+1})`} { display: none; }
            .${scriptId}-settings-btn { font-size: 14px; cursor: pointer; vertical-align: middle; margin-left: 10px; }
            #${scriptId}-container { border: none; font-size: 100%; }
            #${scriptId} pre { white-space: pre-wrap; white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word; }
            #${scriptId} .example { display: flex; align-items: center; margin-bottom: 1em; cursor: pointer; }
            #${scriptId} .example > * { flex-grow: 1; flex-shrink: 1; flex-basis: min-content; }
            #${scriptId} .example img { padding-right: 1em; max-width: 200px; }
            #${scriptId} .example .audio-btn { background-color: transparent; margin-left: 0.25em; }
            #${scriptId} .example .audio-btn.audio-idle { opacity: 50%; }
            #${scriptId} .example-text { display: table; white-space: normal; }
            #${scriptId} .example-text .title { font-weight: var(--font-weight-bold); }
            #${scriptId} .example-text .ja { font-size: var(--font-size-xlarge); }
            /* Set the default and on-hover appearance */
            #${scriptId} .show-on-hover:hover, #${scriptId} .show-ruby-on-hover:hover ruby rt { background-color: inherit; color: inherit; visibility: visible; }
            /* Set the color/appearance of the marked keyword */
            #${scriptId} mark, #${scriptId} .show-on-hover:hover mark { background-color: inherit; color: darkcyan; }
            /* Set the appearance for show-on-hover and show-on-click elements when trigger state is inactive */
            #${scriptId} .show-on-hover, #${scriptId} .show-on-hover mark, #${scriptId} .show-on-click, #${scriptId} .show-on-click mark { background-color: #ccc; color: transparent; text-shadow: none; }
            /* Set the appearance for hidden and show-ruby-on-hover elements when trigger state is inactive */
            #${scriptId} .show-ruby-on-hover ruby rt { visibility: hidden; }
            #${scriptId} .hide, #${scriptId} .hide-ruby ruby rt { display: none; }
            `.replaceAll(/(\n|^ {2,})/mg, ''),
        });
        document.getElementsByTagName('head')[0].append(state.styleSheetEl);
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // ----------------------------------------------------FURIGANA---------------------------------------------------- //
    // ---------------------------------------------------------------------------------------------------------------- //

    function Furigana(expression, expressionWithFurigana) {
        this.expression = expression;
        this.expressionWithFurigana = expressionWithFurigana;
        this.keyword = this.keywordRegex = this.firstKeywordIndex = null;
        this.keywordTag = 'mark';
        this.furiganaSegments = this.parseFurigana(expressionWithFurigana);
    }

    Furigana.prototype.setKeyword = function(keyword) {
        this.keyword = keyword ?? null;
        this.keywordRegex = keyword !== null ? new RegExp(keyword, 'g') : null;
        this.firstKeywordIndex = null; // Reset keyword index
    };

    Furigana.prototype.getExpressionHtml = function() {
        return this.keywordRegex === null ? this.expression : this.expression.replaceAll(this.keywordRegex, `<${this.keywordTag}>$&</${this.keywordTag}>`);
    };

    Furigana.prototype.getFuriganaHtml = function() {
        const normalizedSegments = this.normalizeSegments(this.furiganaSegments, this.expression);
        let html = '';
        for (let i = 0; i < normalizedSegments.length; i++) {
            const {base, furigana} = normalizedSegments[i];
            html += furigana !== null ? `<ruby>${base}<rp>[</rp><rt>${furigana}</rt><rp>]</rp></ruby>` : base;
        }
        return html;
    };

    Furigana.prototype.getFirstKeywordIndex = function() {
        if (this.keyword === null) return -1;
        if (this.firstKeywordIndex !== null) return this.firstKeywordIndex;
        return this.firstKeywordIndex = this.expression.search(this.keywordRegex);
    };

    Furigana.prototype.parseFurigana = function(expressionWithFurigana) {
        const segments = [], regex = /([\u3001-\u303F\u3041-\u3096\u30A0-\u30FF\u3400-\u4DB5\u4E00-\u9FCB\uF900-\uFA6A\uFF01-\uFF5E\uFF5F-\uFF9F]+|[^[\]<> \u4E00-\u9FCB]+)(?:\[([^[\]]+)])?/g;
        let match;

        while ((match = regex.exec(expressionWithFurigana)) !== null) {
            segments.push({base: match[1], furigana: (match[2] ?? null)});
        }
        return segments;
    };

    Furigana.prototype.normalizeSegments = function(segments, expression) {
        const normalizedSegments = [], keywordRegex = this.keywordRegex, keywordTag = this.keywordTag;
        let nextIndex = 0, markStart = 0, markRemaining = 0;
        const keywordMatches = keywordRegex !== null ? Array.from(expression.matchAll(keywordRegex)) : [];

        for (let i = 0; i < segments.length; i++) {
            const curIndex = nextIndex;
            if (i === segments.length - 1) {
                nextIndex = expression.length;
            } else {
                nextIndex = expression.indexOf(segments[i + 1].base[0], nextIndex);
                if (nextIndex === -1)
                    nextIndex = curIndex + segments[i].base.length;
            }
            let matchingSection = expression.substring(curIndex, nextIndex);
            let offset = 0;
            for (let j = 0; j < keywordMatches.length; j++){
                const match = keywordMatches[j];
                if (match.index === undefined) continue;
                const [start, end] = [match.index, match.index + match[0].length];
                if (this.firstKeywordIndex === null && start >= 0)
                    this.firstKeywordIndex = start;
                if (start >= curIndex && start < nextIndex) {
                    markStart = offset + start - curIndex;
                    markRemaining = offset + end - curIndex - markStart;
                }
                if (markRemaining > 0) {
                    const segmentLength = matchingSection.length;
                    const markEnd = Math.min(markStart + markRemaining, segmentLength);
                    const precedingSection = matchingSection.substring(0, markStart);
                    const markedSegment = matchingSection.substring(markStart, markEnd);
                    const remainingSegment = matchingSection.substring(markEnd);
                    matchingSection = `${precedingSection}<${keywordTag}>${markedSegment}</${keywordTag}>${remainingSegment}`;
                    markStart = 0;
                    markRemaining -= Math.min(markRemaining, markedSegment.length);
                    if (remainingSegment.length === 0)
                        break;
                    offset += (keywordTag.length * 2) + 5; // 5 = '<></>'.length
                }
            }
            normalizedSegments.push({ base: matchingSection, furigana: segments[i].furigana });
        }
        return normalizedSegments;
    };
})();
