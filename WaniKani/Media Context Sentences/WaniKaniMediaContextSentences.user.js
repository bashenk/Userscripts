// ==UserScript==
// @name         WaniKani Media Context Sentences
// @description  Formerly named "Wanikani Anime Sentences 2". Adds example sentences from anime, dramas, games, literature, and news for vocabulary from immersionkit.com.
// @version      3.0.3
// @author       Inserio
// @namespace    https://greasyfork.org/en/users/11878
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @require      https://greasyfork.org/scripts/430565-wanikani-item-info-injector/code/WaniKani%20Item%20Info%20Injector.user.js?version=1416982
// @copyright    2021+, Paul Connolly
// @copyright    2024, Brian Shenk
// @license      MIT; http://opensource.org/licenses/MIT
// @run-at       document-body
// @grant        none
// ==/UserScript==
// Original script by psdcon
/* jshint esversion: 11 */
// noinspection CssUnusedSymbol,JSUnusedGlobalSymbols,JSNonASCIINames
/* global wkof, wkItemInfo */
(() => {
    'use strict';
    const wkof = window.wkof, oldScriptId = 'anime-sentences-2', scriptName = "Media Context Sentences", scriptId = 'media-context-sentences', styleSheetName = `${scriptId}-style`;
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
            // Filters the results to only those with sentences exactly matching the keyword (i.e., this filters after the results are found)
            // TODO: Make the kanji (i.e., not the okurigana) required by default for non-kana-only vocab
            filterExactMatch: false,
            // Wraps the search term in Japanese quotes (i.e.,「term」) before sending it to Immersion Kit
            filterExactSearch: false,
            // Tells Immersion Kit to filter out results containing words more than 1 level higher than your current WaniKani level (possibly inaccurate, due to frequent changes in WK level contents)
            filterWaniKaniLevel: false,
            // If greater than 0, tells Immersion Kit to filter out results that are not at the selected JLPT level or easier.
            filterJLPTLevel: 0,
            // Mapping of the content title to the enabled state. All content is enabled by default.
            // Titles taken from https://www.immersionkit.com/information and modified after testing a few example search results.
            filterAnimeShows: {
                'Alya Sometimes Hides Her Feelings in Russian': true,
                'Angel Beats!': true,
                'Anohana the flower we saw that day': true,
                'Assassination Classroom Season 1': true,
                'Bakemonogatari': true,
                'Boku no Hero Academia Season 1': true,
                'Bunny Drop': true,
                'Cardcaptor Sakura': true,
                'Chobits': true,
                'Clannad': true,
                'Clannad After Story': true,
                'Code Geass Season 1': true,
                'Daily Lives of High School Boys': true,
                'Death Note': true,
                'Demon Slayer - Kimetsu no Yaiba': true,
                'Durarara!!': true,
                'Erased': true,
                'Fairy Tail': true,
                'Fate Stay Night Unlimited Blade Works': true,
                'Fate Zero': true,
                'From the New World': true,
                'Fruits Basket Season 1': true,
                'Fullmetal Alchemist Brotherhood': true,
                "God's Blessing on this Wonderful World!": true,
                'Haruhi Suzumiya': true,
                'Hunter × Hunter': true,
                'Hyouka': true,
                'Is The Order a Rabbit': true,
                'K-On!': true,
                'Kakegurui': true,
                'Kanon (2006)': true,
                'Kill la Kill': true,
                "Kino's Journey": true,
                'Kokoro Connect': true,
                'Little Witch Academia': true,
                'Lucky Star': true,
                'Mahou Shoujo Madoka Magica': true,
                'Mononoke': true,
                "My Little Sister Can't Be This Cute": true,
                'New Game!': true,
                'Nisekoi': true,
                'No Game No Life': true,
                'Noragami': true,
                'One Week Friends': true,
                'Psycho Pass': true,
                'Re Zero − Starting Life in Another World': true,
                'ReLIFE': true,
                'Shirokuma Cafe': true,
                'Sound! Euphonium': true,
                'Steins Gate': true,
                'Sword Art Online': true,
                'The Pet Girl of Sakurasou': true,
                'Toradora!': true,
                'Wandering Witch The Journey of Elaina': true,
                'Your Lie in April': true,
            },
            filterAnimeMovies: {
                'The Garden of Words': true,
                'The Girl Who Leapt Through Time': true,
                'The World God Only Knows': true,
                'Weathering with You': true,
                'Wolf Children': true,
                'Your Name': true,
            },
            filterGhibli: {
                'Castle in the sky': true,
                'From Up on Poppy Hill': true,
                'Grave of the Fireflies': true,
                "Howl's Moving Castle": true,
                "Kiki's Delivery Service": true,
                'My Neighbor Totoro': true,
                'Only Yesterday': true,
                'Princess Mononoke': true,
                'Spirited Away': true,
                'The Cat Returns': true,
                'The Secret World of Arrietty': true,
                'The Wind Rises': true,
                'When Marnie Was There': true,
                'Whisper of the Heart': true,
            },
            filterDramas: {
                '1 Litre of Tears': true,
                'Border': true,
                'Good Morning Call Season 1': true,
                'Good Morning Call Season 2': true,
                'I am Mita, Your Housekeeper': true,
                "I'm Taking the Day Off": true,
                'Legal High Season 1': true,
                'Million Yen Woman': true,
                'Mob Psycho 100': true,
                'Overprotected Kahoko': true,
                'Quartet': true,
                'Sailor Suit and Machine Gun (2006)': true,
                'Smoking': true,
                'The Journalist': true,
                'Weakest Beast': true,
            },
            filterGames: {
                'Cyberpunk 2077': true, 'Skyrim': true, 'Witcher 3': true,
                // The following are currently not queryable via the API (but maybe they will be someday?)
                // "NieR: Automata": true, "NieR Re[in]carnation": true, "Zelda: Breath of the Wild": true,
            },
            filterLiterature: {
                '黒猫': true,
                'おおかみと七ひきのこどもやぎ': true,
                'マッチ売りの少女': true,
                'サンタクロースがやってきた': true,
                '君死にたまふことなかれ': true,
                '蝉': true,
                '胡瓜': true,
                '若鮎について': true,
                '黒足袋': true,
                '柿': true,
                'お母さんの思ひ出': true,
                '砂をかむ': true,
                '虻のおれい': true,
                'がちゃがちゃ': true,
                '犬のいたずら': true,
                '犬と人形': true,
                '懐中時計': true,
                'きのこ会議': true,
                'お金とピストル': true,
                '梅のにおい': true,
                '純真': true,
                '声と人柄': true,
                '心の調べ': true,
                '愛': true,
                '期待と切望': true,
                '空の美': true,
                'いちょうの実': true,
                '虔十公園林': true,
                'クねずみ': true,
                'おきなぐさ': true,
                'さるのこしかけ': true,
                'セロ弾きのゴーシュ': true,
                'ざしき童子のはなし': true,
                '秋の歌': true,
                '赤い船とつばめ': true,
                '赤い蝋燭と人魚': true,
                '赤い魚と子供': true,
                '秋が　きました': true,
                '青いボタン': true,
                'ある夜の星たちの話': true,
                'いろいろな花': true,
                'からすとかがし': true,
                '片田舎にあった話': true,
                '金魚売り': true,
                '小鳥と兄妹': true,
                'おじいさんが捨てたら': true,
                'おかめどんぐり': true,
                'お母さん': true,
                'お母さんのお乳': true,
                'おっぱい': true,
                '少年と秋の日': true,
                '金のくびかざり': true,
                '愛よ愛': true,
                '気の毒な奥様': true,
                '新茶': true,
                '初夏に座す': true,
                '三角と四角': true,
                '赤い蝋燭': true,
                '赤とんぼ': true,
                '飴だま': true,
                'あし': true,
                'がちょうのたんじょうび': true,
                'ごん狐': true,
                '蟹のしょうばい': true,
                'カタツムリノ ウタ': true,
                '木の祭り': true,
                'こぞうさんのおきょう': true,
                '去年の木': true,
                'おじいさんのランプ': true,
                '王さまと靴屋': true,
                '落とした一銭銅貨': true,
                'サルト サムライ': true,
                '里の春、山の春': true,
                'ウサギ 新美 南吉': true,
                'あひるさん と 時計': true,
                '川へおちた玉ねぎさん': true,
                '小ぐまさんのかんがへちがひ': true,
                'お鍋とお皿とカーテン': true,
                'お鍋とおやかんとフライパンのけんくわ': true,
                'ひらめの学校': true,
                '狐物語': true,
                '桜の樹の下には': true,
                '瓜子姫子': true,
                'ああしんど': true,
                '葬式の行列': true,
                '風': true,
                '子どものすきな神さま': true,
                '喫茶店にて': true,
                '子供に化けた狐': true,
                '顔': true,
                '四季とその折々': true,
            },
            filterNews: {
                '平成30年阿蘇神社で甘酒の仕込み始まる': true,
                'フレッシュマン！5月号阿蘇広域行政事務組合': true,
                'フレッシュマン！7月号春工房、そば処ゆう雀': true,
                'フレッシュマン！11月号内牧保育園': true,
                '山田小学校で最後の稲刈り': true,
            },
            // Enables debugging statements, to find and help remedy bugs when they occur.
            // This works as a "fail-early" measure and will not show any normal results when an issue is found.
            debugging: false,
        },
        // Used for modifying the current WK Item Info Injector listener
        wkItemInfoHandler: null,
        // Used for working with the settings dialog and determining which sentences to show
        content: {selections: new Set()},
        // Current vocab from wkItemInfo
        item: null,
        // Cached to aid in determining whether retries should be done
        currentUrl: null,
        // Cached so that sentences can be re-rendered after settings change
        immersionKitDataCache: {},
        // Cache for the number of fetches done for any given url
        fetchCount: {},
        // Referenced for quick access to the base node
        baseEl: null,
        // Referenced so that sentences can be re-rendered after settings change
        sentencesEl: null,
        // Reference for quick access to the style sheet
        styleSheetEl: null,
    };
    const exampleLimitSearchRegex = new RegExp(`(#${scriptId} \\.example:nth-child)(\\(n\\+\\d+\\))?`); // /(#media-context-sentences \.example:nth-child)(\(n\+\d+\))?/
    const maxHeightSearchRegex = new RegExp(`(#${scriptId}\\s*{[^}]*?max-height:).*?;`); // /(#media-context-sentences\s*{[^}]*?max-height:) *[\d.] *+\w*;/
    const validCssUnitRegex = /^((\d*\.)?\d+)((px)|(em)|(%)|(ex)|(ch)|(rem)|(vw)|(vh)|(vmin)|(vmax)|(cm)|(mm)|(in)|(pt)|(pc))$/i;

    init();

    function init() {
        if (wkof) {
            wkof.include("Apiv2,Settings,Menu");
            document.documentElement.addEventListener('turbo:load', () => setTimeout(() => wkof.ready('Menu').then(installMenu), 0));
            wkof.ready("Settings")
                .then(createContentListsForSettings)
                .then(migrateOldSettingsLocation)
                .then(loadSettings)
                .then(migrateOldSettings)
                .then(mergeSettings)
                .then(async () => await Promise.all([wkof.ready("Apiv2"), createStyle(), updateDesiredShows()]))
                .then(setWaniKaniItemInfoListener);
        } else {
            console.warn(`${scriptName}: You are not using Wanikani Open Framework which this script utilizes to provide the settings dialog for the script. You can still use ${scriptName} normally though`);
            Promise.all([createStyle(), updateDesiredShows()])
                   .then(setWaniKaniItemInfoListener);
        }
    }

    function setWaniKaniItemInfoListener() {
        if (state.wkItemInfoHandler)
            state.wkItemInfoHandler.remove();
        state.wkItemInfoHandler = wkItemInfo.forType(`${state.settings.showOnKanji ? 'kanji,' : ''}vocabulary,kanaVocabulary`).under(`examples`).notify(onExamplesVisible);
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // -----------------------------------------------MAIN FUNCTIONALITY----------------------------------------------- //
    // ---------------------------------------------------------------------------------------------------------------- //

    async function addContextSentences() {
        state.baseEl = document.createElement("div");
        state.baseEl.setAttribute("id", `${scriptId}-container`);
        state.sentencesEl = document.createElement("div");
        state.sentencesEl.setAttribute("id", `${scriptId}`);
        state.sentencesEl.innerText = 'Loading...';

        const titleEl = document.createElement("span");
        const header = [], additionalSettings = {sectionName: scriptName, under: 'examples'};
        titleEl.textContent = scriptName;
        header.push(titleEl);

        if (wkof) {
            const settingsBtn = document.createElement("span");
            settingsBtn.textContent = '⚙️';
            settingsBtn.classList.add(`${scriptId}-settings-btn`);
            settingsBtn.onclick = openSettings;
            header.push(settingsBtn);
        }

        state.baseEl.append(state.sentencesEl);

        if (state.item.injector)
            state.item.injector.appendSubsection(header, state.baseEl, additionalSettings);

        state.currentUrl = getNewImmersionKitUrl(state.settings.filterExactSearch);
        const data = await fetchImmersionKitData();
        await renderSentences(data);
    }

    function getNewImmersionKitUrl(exact) {
        let keyword = state.item.characters.replace('〜', ''); // for "counter" kanji
        if (exact) keyword = `「${keyword}」`;
        // TODO: Add &tags=
        const jlptFilter = state.settings.filterJLPTLevel !== 0 ? `&jlpt=${state.settings.filterJLPTLevel}` : '',
            wkLevelFilter = state.settings.filterWaniKaniLevel ? `&wk=${wkof.user.level}` : '', tags = '';
        return `https://api.immersionkit.com/look_up_dictionary?keyword=${keyword}${tags}${jlptFilter}${wkLevelFilter}`;
    }

    async function fetchImmersionKitData() {
        const url1 = state.currentUrl ??= getNewImmersionKitUrl(state.settings.filterExactSearch);
        const url2 = getNewImmersionKitUrl(!state.settings.filterExactSearch);
        let url = url1;

        try {
            for (;;) {
                state.fetchCount[url] ??= 0;
                if (state.immersionKitDataCache[url1] != null)
                    return state.immersionKitDataCache[url1];
                else if (state.item.type === 'kanji' && state.fetchCount[url1] > 0 && state.immersionKitDataCache[url2] != null) {
                    return state.immersionKitDataCache[url2];
                }
                state.fetchCount[url]++;
                state.sentencesEl.innerText = 'Fetching...';
                const response = await fetch(url),
                    json = await response.json(),
                    data = json.data[0];
                if (data.examples.length > 0)
                    return state.immersionKitDataCache[url] = data;
                else if (state.item.type === 'kanji' && !state.fetchCount[url2]) {
                    url = url2;
                    continue;
                } else if (state.fetchCount[url] > state.settings.fetchRetryCount)
                    return data;
                else
                    url = url1;
                const seconds = Math.round(state.settings.fetchRetryDelay / 100) / 10; // round to nearest first decimal
                state.sentencesEl.innerText = `Retrying in ${seconds} second${seconds !== 1 ? 's' : ''}`;
                await sleep(state.settings.fetchRetryDelay);
            }
        } catch (e) {
            console.error(`Error fetching Immersion Kit data: ${e.message}`);
        }
        return null;
    }

    async function onExamplesVisible(item) {
        state.item = item; // current vocab item
        try {
            await addContextSentences(item);
        } catch (e) {
            console.error(`Error while adding ${scriptName} section: ${e.message}`);
        }
    }

    function sortSentences(sentences, primarySorting, secondarySorting) {
        const categoryCompare = (a, b) => a.category.localeCompare(b.category);
        const sourceCompare = (a, b) => a.deck_name.localeCompare(b.deck_name);
        const shortnessCompare = (a, b) => a.sentence.length - b.sentence.length;
        const longnessCompare = (a, b) => b.sentence.length - a.sentence.length;
        const positionCompare = (a, b) => a.furiganaObject.getFirstKeywordIndex() - b.furiganaObject.getFirstKeywordIndex();
        switch (primarySorting) {
            case 'category':
                sentences.sort((a, b) => {
                    const primaryOrder = categoryCompare(a, b);
                    if (primaryOrder !== 0) return primaryOrder;
                    switch (secondarySorting) {
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
                });
                break;
            case 'longness':
                sentences.sort((a, b) => {
                    const primaryOrder = longnessCompare(a, b);
                    if (primaryOrder !== 0) return primaryOrder;
                    switch (secondarySorting) {
                        case 'category':
                            return categoryCompare(a, b);
                        case 'source':
                            return sourceCompare(a, b);
                        case 'position':
                            return positionCompare(a, b);
                        case 'default':
                        default:
                            return primaryOrder;
                    }
                });
                break;
            case 'shortness':
                sentences.sort((a, b) => {
                    const primaryOrder = shortnessCompare(a, b);
                    if (primaryOrder !== 0) return primaryOrder;
                    switch (secondarySorting) {
                        case 'category':
                            return categoryCompare(a, b);
                        case 'source':
                            return sourceCompare(a, b);
                        case 'position':
                            return positionCompare(a, b);
                        case 'default':
                        default:
                            return primaryOrder;
                    }
                });
                break;
            case 'source':
                sentences.sort((a, b) => {
                    const primaryOrder = sourceCompare(a, b);
                    if (primaryOrder !== 0) return primaryOrder;
                    switch (secondarySorting) {
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
                });
                break;
            case 'position':
                sentences.sort((a, b) => {
                    const primaryOrder = positionCompare(a, b);
                    if (primaryOrder !== 0) return primaryOrder;
                    switch (secondarySorting) {
                        case 'category':
                            return categoryCompare(a, b);
                        case 'shortness':
                            return shortnessCompare(a, b);
                        case 'longness':
                            return longnessCompare(a, b);
                        case 'source':
                            return sourceCompare(a, b);
                        case 'default':
                        default:
                            return primaryOrder;
                    }
                });
                break;
            case 'default':
            default:
                break;
        }
    }

    async function renderSentences(data) {
        // Called from immersionkit response, and on settings save
        if (data === null)
            return state.sentencesEl.innerText = 'Error fetching examples from Immersion Kit.';
        if (data.examples.length === 0)
            return state.sentencesEl.innerText = `${state.settings.fetchRetryCount > 0 ? "Retry limit reached. " : ''}No sentences found.`;
        state.sentencesEl.innerText = 'Loading...';
        if (state.settings.debugging)
            state.debugList = new Set();
        const sentencesToDisplay = [];
        // Exclude non-selected titles
        for (let i = 0; i < data.examples.length; i++) {
            const example = data.examples[i];
            if (!(state.content.selections.has(example.deck_name) || state.content.selections.has(example.deck_name_japanese))) {
                if (state.settings.debugging)
                    state.debugList.add(`English: "${example.deck_name}"; Japanese: "${example.deck_name_japanese}"`);
                continue;
            }
            // strip directional formatting and other non-displaying characters from sentences (...how they got there in the first place, I won't ask)
            const directionalFormattingCharsRegex = /[\u202A-\u202E\u2066-\u2069\uE4C6]/g;
            example.sentence = example.sentence.replace(directionalFormattingCharsRegex,'');
            example.sentence_with_furigana = example.sentence_with_furigana.replace(directionalFormattingCharsRegex,'');
            example.furiganaObject = new Furigana(example.sentence, example.sentence_with_furigana);
            const itemKeyword = state.item.characters.replace('〜', '');
            if (state.settings.filterExactMatch && !example.sentence.includes(itemKeyword)) {
                //if (state.settings.debugging) state.debugList.add(`English: "${example.deck_name}"; Japanese: "${example.deck_name_japanese}"; ExactMatch: false`);
                continue;
            }

            const keywordSet = new Set(); // use a set to prevent duplicates from being added.
            if (!state.settings.filterExactMatch && example.word_index.length > 0)
                for (let j = 0; j < example.word_index.length; j++)
                    keywordSet.add(example.word_list[example.word_index[j]]);
            const sentenceKeywords = Array.from(keywordSet);
            const regexExpression = (sentenceKeywords.length === 0
                // default to the keyword from the item if word_list is empty
                ? itemKeyword.split('').join('\\s*') // intersperse whitespace quantifier to match awkwardly spaced out sentences.
                // use the keywords from the sentence data if they exist properly.
                : sentenceKeywords.join('|')); // use alternation when using the example's word_list (which will end up creating tags around each "word").
            example.furiganaObject.setKeyword(regexExpression);

            sentencesToDisplay.push(example);
        }
        if (sentencesToDisplay.length === 0 || state.settings.debugging && state.debugList.size > 0) {
            const preElement = document.createElement("pre");
            const deckCountsAsJson = JSON.stringify(data.deck_count, undefined, "\t");
            preElement.innerHTML = `${sentencesToDisplay.length>0 ? sentencesToDisplay.length : 'No'} sentences found for your selected filters (${data.examples.length-sentencesToDisplay.length} are available but hidden; see below for details and entry counts)<br>${deckCountsAsJson}`;
            if (state.settings.debugging)
                preElement.innerHTML += `<br><br>Names for decks currently hidden:<br>${Array.from(state.debugList).join('<br>')}`;
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
        const parentEl = document.createElement("div");
        parentEl.className = 'example';

        const imgEl = document.createElement("img");
        imgEl.src = example.image_url ?? "";
        imgEl.decoding = "auto";
        imgEl.alt = '';

        const textParentEl = document.createElement("div");
        textParentEl.className = 'example-text';
        attachAudioOnClickListener(parentEl);

        const textTitleEl = document.createElement("div");
        textTitleEl.className = 'title';
        textTitleEl.title = example.id; // TODO: Consider removing/moving elsewhere
        textTitleEl.innerText = example.deck_name;

        const audioButtonEl = document.createElement("button");
        audioButtonEl.type = 'button';
        audioButtonEl.className = 'audio-btn audio-idle';
        audioButtonEl.title = 'Play Audio';
        audioButtonEl.innerText = '🔈';
        configureAudioElement(audioButtonEl, example);

        const jaEl = document.createElement("div");
        jaEl.className = 'ja';

        const jaSpanEl = document.createElement("span");
        jaSpanEl.classList.add('base');
        jaSpanEl.innerHTML = example.furiganaObject.getExpressionHtml();

        const jaFuriganaSpanEl = document.createElement("span");
        jaFuriganaSpanEl.classList.add('furigana');
        jaFuriganaSpanEl.innerHTML = example.furiganaObject.getFuriganaHtml();

        const enEl = document.createElement("div");
        enEl.className = 'en';

        const enSpanEl = document.createElement("span");
        enSpanEl.innerHTML = example.translation;

        const elements = [
            {element: jaSpanEl,
                classListUpdates: [{name: 'showJapanese', value: state.settings.showJapanese}, {name: 'showFurigana', value: state.settings.showFurigana}],
                clickListener: {name: 'showJapanese', value: state.settings.showJapanese}},
            {element: jaFuriganaSpanEl,
                classListUpdates: [{name: 'showJapanese', value: state.settings.showJapanese}, {name: 'showFurigana', value: state.settings.showFurigana}],
                clickListener: {name: 'showFurigana', value: state.settings.showFurigana}},
            {element: enSpanEl,
                classListUpdates: [{name: 'showEnglish', value: state.settings.showEnglish}],
                clickListener: {name: 'showEnglish', value: state.settings.showEnglish}},
        ];
        const promises = [];
        for (const {element, classListUpdates, clickListener} of elements) {
            for (const {name, value} of classListUpdates)
                promises.push(updateClassListForSpanElement(element, name, value));
            promises.push(updateOnClickListenerForSpanElement(jaSpanEl, clickListener.name, clickListener.value));
        }
        await Promise.all(promises);

        parentEl.append(imgEl);
        textTitleEl.append(audioButtonEl);
        textParentEl.append(textTitleEl);

        jaEl.append(jaSpanEl);
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

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function isEmptyObject(value) {
        if (value == null) {
            // null or undefined
            return false;
        }

        if (typeof value !== 'object') {
            // boolean, number, string, function, etc.
            return false;
        }

        const proto = Object.getPrototypeOf(value);

        // consider `Object.create(null)`, commonly used as a safe map
        // before `Map` support, an empty object as well as `{}`
        if (proto !== null && proto !== Object.prototype) {
            return false;
        }

        for (const prop in value) {
            if (Object.hasOwn(value, prop)) {
                return false;
            }
        }

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

    function updateObjectValuesToValuesFromOtherObject(object, otherObject) {
        const keys = Object.keys(object);
        const values = Array.isArray(otherObject) ? otherObject : Object.values(otherObject);
        for (let i = 0; i < keys.length && i < values.length; i++) {
            object[keys[i]] = values[i];
        }
        return object;
    }

    function combineObjectsWithTrueValuesToSet(...objects) {
        const set = new Set();
        for (let i = 0; i < objects.length; i++){
            const entries = Object.entries(objects[i]);
            for (let j = 0; j < entries.length; j++){
                const [key, value] = entries[j];
                if (value)
                    set.add(key);
            }
        }
        return set;
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
        let audioContainer;
        const idleClassName = "audio-idle";
        const playingClassName = "audio-play";
        const onPlay = () => {
            element.classList.replace(idleClassName, playingClassName);
            element.textContent = '🔊';
        }, onStop = () => {
            element.classList.replace(playingClassName, idleClassName);
            element.textContent = '🔈';
            removeAudioElement(audioContainer);
        };
        element.onclick = function(e) {
            e.stopPropagation(); // prevent this click from triggering twice in some scenarios
            if ((audioContainer = state.baseEl.querySelector("audio")) !== null) {
                const prevSource = audioContainer.src;
                audioContainer.pause();
                if (prevSource === example.sound_url)
                    return;
            }
            audioContainer = document.createElement("audio");
            audioContainer.src = example.sound_url;
            audioContainer.playbackRate = state.settings.playbackRate * 2 / 100;
            audioContainer.volume = state.settings.playbackVolume / 100;
            audioContainer.onplay = onPlay;
            audioContainer.onpause = onStop;
            audioContainer.onended = onStop;
            audioContainer.onabort = onStop;
            state.baseEl.append(audioContainer);
            audioContainer.play();
        };
    }

    function removeAudioElement(element) {
        if (element === undefined || element === null)
            return;
        element.src = "";
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
                if (element.classList.contains('base'))
                    element.classList.toggle('hide', value !== 'never');
                else if (element.classList.contains('furigana')) {
                    element.classList.toggle('show-ruby-on-hover', value === 'onhover');
                    element.classList.toggle('hide', value === 'never');
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
                if (name !== 'showFurigana') await removeOnClickEventListener(element);
                break;
            case 'onclick':
                await attachShowOnClickEventListener(element);
                break;
            default:
                return;
        }
    }
    function attachAudioOnClickListener(element) {
        // Click anywhere plays the audio
        element.onclick = function () {
            if (this.classList.contains('show-on-click')) return;
            const button = this.querySelector('.audio-btn');
            button.click();
        };
    }
    async function attachShowOnClickEventListener(element) {
        // Assign onclick function to toggle the .show-on-click class
        element.onclick = e => {
            e.stopPropagation(); // prevent this click from triggering the audio to play
            element.classList.toggle('show-on-click');
        };
    }

    async function removeOnClickEventListener(element) {
        element.onclick = null;
    }

    // ---------------------------------------------------------------------------------------------------------------- //
    // ----------------------------------------------------SETTINGS---------------------------------------------------- //
    // ---------------------------------------------------------------------------------------------------------------- //

    async function createContentListsForSettings() {
        // Create the content lists to be used by the WKOF settings dialog.
        await Promise.all([
            setObjectEntriesEqualToOtherObjectKeys(state.content.animeShows = {}, state.settings.filterAnimeShows),
            setObjectEntriesEqualToOtherObjectKeys(state.content.animeMovies = {}, state.settings.filterAnimeMovies),
            setObjectEntriesEqualToOtherObjectKeys(state.content.ghibli = {}, state.settings.filterGhibli),
            setObjectEntriesEqualToOtherObjectKeys(state.content.dramas = {}, state.settings.filterDramas),
            setObjectEntriesEqualToOtherObjectKeys(state.content.games = {}, state.settings.filterGames),
            setObjectEntriesEqualToOtherObjectKeys(state.content.literature = {}, state.settings.filterLiterature),
            setObjectEntriesEqualToOtherObjectKeys(state.content.news = {}, state.settings.filterNews),
        ]);
    }

    /** Installs the options button in the menu */
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
            return await wkof.Settings.load(scriptId, state.settings);
        } catch (e) {
            console.error(`Error loading settings from WaniKani Open Framework: ${e.message}`);
        }
    }

    function mergeSettings(settings) {
        // need to use Object.assign() in order to avoid updating the state.settings object byref whenever it's saved
        Object.assign(state.settings, settings);
    }

    async function migrateOldSettings(settings) {
        let changed;
        // update legacy maxBoxHeight from a simple number to a text value to allow specifying the exact measurement unit (e.g., if something other than "px" is desired)
        if (!Number.isNaN(Number(settings.maxBoxHeight))) changed = wkof.settings[scriptId].maxBoxHeight = `${settings.maxBoxHeight}px`;
        // update legacy sentenceSorting values from "none" to "source"
        if (settings.sentenceSorting === 'none') changed = wkof.settings[scriptId].sentenceSorting = 'source';
        // update legacy playbackRate settings from a decimal value to a raw percentage out of 200
        if (settings.playbackRate <= 2) changed = wkof.settings[scriptId].playbackRate = settings.playbackRate * 50;
        // update legacy filters from simple arrays or pseudo-array objects into objects with the key being the source title
        if (settings.filterAnimeShows[0] !== undefined) changed = wkof.settings[scriptId].filterAnimeShows = updateObjectValuesToValuesFromOtherObject(state.settings.filterAnimeShows, settings.filterAnimeShows);
        if (settings.filterAnimeMovies[0] !== undefined) changed = wkof.settings[scriptId].filterAnimeMovies = updateObjectValuesToValuesFromOtherObject(state.settings.filterAnimeMovies, settings.filterAnimeMovies);
        if (settings.filterGhibli[0] !== undefined) changed = wkof.settings[scriptId].filterGhibli = updateObjectValuesToValuesFromOtherObject(state.settings.filterGhibli, settings.filterGhibli);
        if (settings.filterDramas[0] !== undefined) changed = wkof.settings[scriptId].filterDramas = updateObjectValuesToValuesFromOtherObject(state.settings.filterDramas, settings.filterDramas);
        if (settings.filterGames[0] !== undefined) changed = wkof.settings[scriptId].filterGames = updateObjectValuesToValuesFromOtherObject(state.settings.filterGames, settings.filterGames);
        if (settings.filterLiterature[0] !== undefined) changed = wkof.settings[scriptId].filterLiterature = updateObjectValuesToValuesFromOtherObject(state.settings.filterLiterature, settings.filterLiterature);
        if (settings.filterNews[0] !== undefined) changed = wkof.settings[scriptId].filterNews = updateObjectValuesToValuesFromOtherObject(state.settings.filterNews, settings.filterNews);
        if (changed !== undefined) {
            try {
                await wkof.Settings.save(scriptId);
            } catch (e) {
                console.error(`Error migrating old settings from WaniKani Open Framework: ${e.message}`);
            }
        }
        return settings;
    }

    async function migrateOldSettingsLocation() {
        try {
            const oldSettings = await wkof.Settings.load(oldScriptId);
            delete wkof.settings[oldScriptId];
            if (!oldSettings || isEmptyObject(oldSettings))
                return;
            wkof.settings[scriptId] = oldSettings;
            await wkof.Settings.save(scriptId);
            await wkof.file_cache.delete(`wkof.settings.${oldScriptId}`);
        } catch (e) {
            console.error(`Error loading old settings from WaniKani Open Framework: ${e.message}`);
        }
    }

    async function onSettingsSaved(updatedSettings) {
        // Called when the user clicks the Save button on the Settings dialog.
        let shouldRerender = false;
        const {
            exampleLimit, // changes handled in onSettingsClosed
            fetchRetryCount, // changes handled in onSettingsClosed
            fetchRetryDelay, // changes handled in onSettingsClosed
            filterAnimeMovies,
            filterAnimeShows,
            filterDramas,
            filterExactMatch,
            filterExactSearch,
            filterGames,
            filterGhibli,
            filterJLPTLevel,
            filterLiterature,
            filterNews,
            filterWaniKaniLevel,
            maxBoxHeight, // changes handled in onSettingsClosed
            playbackRate, // changes handled in onSettingsClosed
            playbackVolume, // changes handled in onSettingsClosed
            sentenceSorting,
            sentenceSortingSecondary,
            showEnglish, // changes handled in onSettingsClosed
            showFurigana, // changes handled in onSettingsClosed
            showJapanese, // changes handled in onSettingsClosed
            showOnKanji, // changes handled in onSettingsClosed
            debugging, // Not implemented in settings
            highlighting // Not implemented
        } = state.settings;
        const {
            exampleLimit: exampleLimitNew, // changes handled in onSettingsClosed
            fetchRetryCount: fetchRetryCountNew, // changes handled in onSettingsClosed
            fetchRetryDelay: fetchRetryDelayNew, // changes handled in onSettingsClosed
            filterAnimeMovies: filterAnimeMoviesNew,
            filterAnimeShows: filterAnimeShowsNew,
            filterDramas: filterDramasNew,
            filterExactMatch: filterExactMatchNew,
            filterExactSearch: filterExactSearchNew,
            filterGames: filterGamesNew,
            filterGhibli: filterGhibliNew,
            filterJLPTLevel: filterJLPTLevelNew,
            filterLiterature: filterLiteratureNew,
            filterNews: filterNewsNew,
            filterWaniKaniLevel: filterWaniKaniLevelNew,
            maxBoxHeight: maxBoxHeightNew, // changes handled in onSettingsClosed
            playbackRate: playbackRateNew, // changes handled in onSettingsClosed
            playbackVolume: playbackVolumeNew, // changes handled in onSettingsClosed
            sentenceSorting: sentenceSortingNew,
            sentenceSortingSecondary: sentenceSortingSecondaryNew,
            showEnglish: showEnglishNew, // changes handled in onSettingsClosed
            showFurigana: showFuriganaNew, // changes handled in onSettingsClosed
            showJapanese: showJapaneseNew, // changes handled in onSettingsClosed
            showOnKanji: showOnKanjiNew, // changes handled in onSettingsClosed
            debugging: debuggingNew, // Not implemented in settings
            highlighting: highlightingNew, // Not implemented
        } = updatedSettings;

        const animeShowsListsDiffer = !arrayValuesEqual(filterAnimeShows,filterAnimeShowsNew),
            animeMoviesListsDiffer = !arrayValuesEqual(filterAnimeMovies,filterAnimeMoviesNew),
            ghibliListsDiffer = !arrayValuesEqual(filterGhibli,filterGhibliNew),
            dramasListsDiffer = !arrayValuesEqual(filterDramas,filterDramasNew),
            gamesListsDiffer = !arrayValuesEqual(filterGames,filterGamesNew),
            literatureListsDiffer = !arrayValuesEqual(filterLiterature,filterLiteratureNew),
            newsListsDiffer = !arrayValuesEqual(filterNews,filterNewsNew);
        // avoid many issues by updating the values manually exactly as desired
        // state.settings.exampleLimit = exampleLimitNew;
        // state.settings.fetchRetryCount = fetchRetryCountNew;
        // state.settings.fetchRetryDelay = fetchRetryDelayNew;
        state.settings.filterExactMatch = filterExactMatchNew;
        state.settings.filterExactSearch = filterExactSearchNew;
        state.settings.filterJLPTLevel = filterJLPTLevelNew;
        state.settings.filterWaniKaniLevel = filterWaniKaniLevelNew;
        // state.settings.maxBoxHeight = !Number.isNaN(Number(maxBoxHeightNew)) ? `${maxBoxHeightNew}px` : maxBoxHeightNew;
        // state.settings.playbackRate = playbackRateNew;
        // state.settings.playbackVolume = playbackVolumeNew;
        state.settings.sentenceSorting = sentenceSortingNew;
        state.settings.sentenceSortingSecondary = sentenceSortingSecondaryNew;
        // state.settings.showEnglish = showEnglishNew;
        // state.settings.showFurigana = showFuriganaNew;
        // state.settings.showJapanese = showJapaneseNew;
        // state.settings.showOnKanji = showOnKanjiNew;
        state.settings.debugging = debuggingNew;
        state.settings.highlighting = highlightingNew;

        // if (showOnKanji !== showOnKanjiNew) setWaniKaniItemInfoListener(showOnKanjiNew);
        if (filterExactSearchNew !== filterExactSearch || filterJLPTLevel !== filterJLPTLevelNew || filterWaniKaniLevel !== filterWaniKaniLevelNew) {
            state.currentUrl = getNewImmersionKitUrl(filterExactSearchNew);
            shouldRerender = true;
        }
        if (animeShowsListsDiffer || animeMoviesListsDiffer || ghibliListsDiffer || dramasListsDiffer || gamesListsDiffer || literatureListsDiffer || newsListsDiffer) {
            state.settings.filterAnimeShows = animeShowsListsDiffer ? filterAnimeShowsNew : filterAnimeShows;
            state.settings.filterAnimeMovies = animeMoviesListsDiffer ? filterAnimeMoviesNew : filterAnimeMovies;
            state.settings.filterGhibli = ghibliListsDiffer ? filterGhibliNew : filterGhibli;
            state.settings.filterDramas = dramasListsDiffer ? filterDramasNew : filterDramas;
            state.settings.filterGames = gamesListsDiffer ? filterGamesNew : filterGames;
            state.settings.filterLiterature = literatureListsDiffer ? filterLiteratureNew : filterLiterature;
            state.settings.filterNews = newsListsDiffer ? filterNewsNew : filterNews;
            await updateDesiredShows();
            shouldRerender = true;
        } else if (filterExactMatch !== filterExactMatchNew || sentenceSorting !== sentenceSortingNew || sentenceSortingSecondary !== sentenceSortingSecondaryNew) {
            shouldRerender = true;
        }
        if (!shouldRerender)
            return;
        const data = await fetchImmersionKitData();
        await renderSentences(data);
    }

    function openSettings(e) {
        e.stopPropagation();
        const showTextOptions = {always: "Always", onhover: "On Hover", onclick: "On Click"},
            showFuriganaOptions = {always: "Always", onhover: "On Hover", never: "Never"},
            jlptOptions = {0: "No Filter", 1: "N1", 2: "N2", 3: "N3", 4: "N4", 5: "N5"},
            sortingMethods = {
                default: "Default",
                category: "Category (anime, drama, etc.)",
                source: "Source Title",
                shortness: "Shortest sentences first",
                longness: "Longest sentences first",
                position: "Position of keyword in sentence",
            };

        function getMissingSortingMethods(currentSecondarySortingOptions) {
            return Object.entries(sortingMethods).filter(([key]) => currentSecondarySortingOptions[key] === undefined);
        }
        function onPrimarySortOptionChanged(name, value) {
            // TODO: This method is a somewhat cursed way of handling this and should be replaced by a natively available method via WKOF if/when I can figure one out.
            const menu = document.getElementById(`${scriptId}_sentenceSortingSecondary`);
            if (menu === null) return;
            const options = menu.options,
                allKeys = Object.keys(sortingMethods),
                missingSortingMethods = getMissingSortingMethods(options);
            for (let i = 0; i < missingSortingMethods.length; i++) {
                const [missingName, missingValue] = missingSortingMethods[i],
                    insertBefore = allKeys.indexOf(missingName),
                    newOption = document.createElement("option");
                newOption.setAttribute('name', missingName);
                newOption.text = missingValue;
                options.add(newOption, insertBefore);
            }
            switch (value) {
                case 'category':
                case 'position':
                    break;
                case 'longness':
                    options.remove(options.namedItem('shortness').index);
                    break;
                case 'shortness':
                    options.remove(options.namedItem('longness').index);
                    break;
                case 'source':
                    options.remove(options.namedItem('category').index);
                    break;
                case 'default':
                default:
                    options.remove(options.namedItem('category').index);
                    options.remove(options.namedItem('source').index);
                    options.remove(options.namedItem('longness').index);
                    options.remove(options.namedItem('shortness').index);
                    options.remove(options.namedItem('position').index);
                    return;
            }
            options.remove(options.namedItem(value).index);
        }
        function getSecondarySortingMethods(primarySorting) {
            const sortingMethodsCopy = Object.assign({}, sortingMethods);
            switch (primarySorting) {
                case 'category':
                    delete sortingMethodsCopy.category;
                    return sortingMethodsCopy;
                case 'longness':
                    delete sortingMethodsCopy.shortness;
                    delete sortingMethodsCopy.longness;
                    return sortingMethodsCopy;
                case 'shortness':
                    delete sortingMethodsCopy.shortness;
                    delete sortingMethodsCopy.longness;
                    return sortingMethodsCopy;
                case 'source':
                    delete sortingMethodsCopy.category;
                    delete sortingMethodsCopy.source;
                    return sortingMethodsCopy;
                case 'position':
                    delete sortingMethodsCopy.position;
                    return sortingMethodsCopy;
                case 'default':
                default:
                    delete sortingMethodsCopy.category;
                    delete sortingMethodsCopy.source;
                    delete sortingMethodsCopy.shortness;
                    delete sortingMethodsCopy.longness;
                    delete sortingMethodsCopy.position;
                    return sortingMethodsCopy;
            }
        }
        const settingsConfig = {
            script_id: scriptId, title: scriptName, on_save: onSettingsSaved, on_close: onSettingsClosed,
            content: {
                general: {
                    type: "page", label: "General", content: {
                        generalDescription: {
                            type: 'section', label: 'Changes to settings in this tab can be previewed in real-time.'
                        }, appearanceOptions: {
                            type: "group", label: "Appearance Options", content: {
                                showOnKanji: {
                                    type: "checkbox", label: "Show on Kanji Items", default: state.settings.showOnKanji,
                                    hover_tip: "Allows the box to appear in the Examples tab for kanji in addition to vocabulary.",
                                    on_change: onShowOnKanjiOptionChanged
                                }, maxBoxHeight: {
                                    type: "text", label: "Box Height", step: 1, min: 0, default: state.settings.maxBoxHeight,
                                    hover_tip: "Set the maximum height of the container box.\nIf no unit type is provided, px (pixels) is automatically appended.",
                                    on_change: onMaxBoxHeightOptionChanged, validate: validateMaxHeight
                                }, exampleLimit: {
                                    type: "number", label: "Example Limit", step: 1, min: 0, default: state.settings.exampleLimit,
                                    hover_tip: "Limit the number of entries that may appear.\nSet to 0 to show as many as possible (note that this can really lag the list generation when there are a very large number of matches).",
                                    on_change: onExampleLimitOptionChanged
                                }, showJapanese: {
                                    type: "dropdown", label: "Show Japanese", default: state.settings.showJapanese, content: showTextOptions,
                                    hover_tip: "When to show Japanese text.\nHover enables transcribing a sentences first (play audio by clicking the image to avoid seeing the answer).",
                                    on_change: onTextShowOptionChanged
                                }, showFurigana: {
                                    type: "dropdown", label: "Show Furigana", default: state.settings.showFurigana, content: showFuriganaOptions,
                                    hover_tip: "These have been autogenerated so there may be mistakes.",
                                    on_change: onTextShowOptionChanged
                                }, showEnglish: {
                                    type: "dropdown", label: "Show English", default: state.settings.showEnglish, content: showTextOptions,
                                    hover_tip: "Hover or click allows testing your understanding before seeing the answer.",
                                    on_change: onTextShowOptionChanged
                                }
                            }
                        }, playbackOptions: {
                            type: "group", label: "Playback Options", content: {
                                playbackRate: {
                                    type: "input", subtype: "range", label: "Playback Speed", default: state.settings.playbackRate,
                                    hover_tip: "Speed to play back audio. (10% - 200%)",
                                    on_change: onAudioPlaybackOptionChanged, validate: validatePlaybackRate
                                }, playbackVolume: {
                                    type: "input", subtype: "range", label: "Playback Volume", default: state.settings.playbackVolume,
                                    hover_tip: "Volume to play back audio. (0% - 100%)",
                                    on_change: onAudioPlaybackOptionChanged, validate: validatePlaybackVolume
                                }

                            }
                        }, immersionKitDataFetchingOptions: {
                            type: "group", label: "Immersion Kit Data Fetching Options", content: {
                                fetchRetryCount: {
                                    type: "number", label: "Fetch Retry Count", step: 1, min: 0, default: state.settings.fetchRetryCount,
                                    hover_tip: "Set how many times you would like to allow retrying the fetch for sentences (to workaround backend issues).",
                                    on_change: onFetchOptionChanged
                                }, fetchRetryDelay: {
                                    type: "number", label: "Fetch Retry Delay (ms)", step: 1, min: 0, default: state.settings.fetchRetryDelay,
                                    hover_tip: "Set the delay in milliseconds between each retry attempt.",
                                    on_change: onFetchOptionChanged
                                }
                            }
                        }
                    }
                }, sorting: {
                    type: 'page', label: 'Sorting', content: {
                        sentenceSortOptions: {
                            type: "group", label: "Sentence Sorting Options", content: {
                                sentenceSorting: {
                                    type: "dropdown", label: "Primary Sorting Method", default: state.settings.sentenceSorting, content: sortingMethods,
                                    hover_tip: "Choose in what order the sentences will be presented.\nDefault = Exactly as retrieved from Immersion Kit",
                                    on_change: onPrimarySortOptionChanged
                                }, sentenceSortingSecondary: {
                                    type: "dropdown", label: "Secondary Sorting Method", default: state.settings.sentenceSortingSecondary, content: getSecondarySortingMethods(state.settings.sentenceSorting),
                                    hover_tip: "Choose how you would like to sort equivalencies in the primary sorting method.\nDefault = No secondary sorting"
                                }
                            }
                        }
                    }
                }, filters: {
                    type: "page", label: "Filters", content: {
                        sentenceFilteringOptions: {
                            type: "group", label: "Sentence Filtering Options", content: {
                                filterExactMatch: {
                                    type: "checkbox", label: "Exact Match", default: state.settings.filterExactMatch,
                                    hover_tip: 'Text must match term exactly, i.e., this filters out conjugations/inflections.\nChecking this for a word with kanji means it will not match if the sentence has it only in kana form and vice-versa for kana-only vocabulary.\n\nThis filtering is done after the results are retrieved from Immersion Kit and may yield different results than the "Exact Search" option (below) when the latter is not used.'
                                },
                                filterAnimeShows: {
                                    type: "list", label: "Anime Shows", multi: true, size: 6, default: state.settings.filterAnimeShows, content: state.content.animeShows,
                                    hover_tip: "Select the anime shows that can be included in the examples."
                                }, filterAnimeMovies: {
                                    type: "list", label: "Anime Movies", multi: true, size: 6, default: state.settings.filterAnimeMovies, content: state.content.animeMovies,
                                    hover_tip: "Select the anime movies that can be included in the examples."
                                }, filterGhibli: {
                                    type: "list", label: "Ghibli Movies", multi: true, size: 6, default: state.settings.filterGhibli, content: state.content.ghibli,
                                    hover_tip: "Select the Studio Ghibli movies that can be included in the examples."
                                }, filterDramas: {
                                    type: "list", label: "Dramas", multi: true, size: 6, default: state.settings.filterDramas, content: state.content.dramas,
                                    hover_tip: "Select the dramas that can be included in the examples."
                                }, filterGames: {
                                    type: "list", label: "Games", multi: true, size: 3, default: state.settings.filterGames, content: state.content.games,
                                    hover_tip: "Select the video games that can be included in the examples."
                                }, filterLiterature: {
                                    type: "list", label: "Literature", multi: true, size: 6, default: state.settings.filterLiterature, content: state.content.literature,
                                    hover_tip: "Select the pieces of literature that can be included in the examples."
                                }, filterNews: {
                                    type: "list", label: "News", multi: true, size: 6, default: state.settings.filterNews, content: state.content.news,
                                    hover_tip: "Select the news sources that can be included in the examples."
                                }
                            }
                        }, immersionKitSearchOptions: {
                            type: "group", label: "Immersion Kit Search Options", content: {
                                immersionKitSearchDescription: {
                                    type: 'section', label: "Changes here cause an API request unless already cached."
                                }, filterExactSearch: {
                                    type: "checkbox", label: "Exact Search", default: state.settings.filterExactSearch,
                                    hover_tip: "Text must match term exactly, i.e., this filters out conjugations/inflections.\nChecking this for a word with kanji means it will not match if the sentence has it only in kana form and vice-versa for kana-only vocabulary."
                                }, filterWaniKaniLevel: {
                                    type: "checkbox", label: "WaniKani Level", default: state.settings.filterWaniKaniLevel,
                                    hover_tip: "Only show sentences with maximum 1 word outside of your current WaniKani level.",
                                }, filterJLPTLevel: {
                                    type: "dropdown", label: "JLPT Level", default: state.settings.filterJLPTLevel, content: jlptOptions,
                                    hover_tip: "Only show sentences matching a particular JLPT Level or easier.",
                                }
                            }
                        }
                    }
                }, credits: {
                    type: "html", label: "Powered by", html: '<a href="https://www.immersionkit.com" style="vertical-align:middle;vertical-align:-webkit-baseline-middle;vertical-align:-moz-middle-with-baseline;">immersionkit.com</a>'
                },
            }
        };
        const dialog = new wkof.Settings(settingsConfig);
        dialog.open();
    }

    async function onAudioPlaybackOptionChanged(name, value) {
        const audioContainer = state.baseEl.querySelector("audio");
        if (audioContainer === null) return;
        switch (name) {
            case "playbackRate":
                if (value === state.settings.playbackRate) return;
                state.settings.playbackRate = value;
                audioContainer.playbackRate = value * 2 / 100;
                break;
            case "playbackVolume":
                if (value === state.settings.playbackVolume) return;
                state.settings.playbackVolume = value;
                audioContainer.volume = value / 100;
                break;
        }
    }

    async function onExampleLimitOptionChanged(name, value) {
        if (value === state.settings.exampleLimit) return;
        // Adjust the example limit with CSS to avoid recreating the list
        const replacement = value===0 ? '$1' : `$1(n+${value+1})`;
        state.settings.exampleLimit = value;
        state.styleSheetEl.innerHTML = state.styleSheetEl.innerHTML.replace(exampleLimitSearchRegex,replacement);
    }

    async function onFetchOptionChanged(name, value) {
        let prevRetryCount;
        switch (name) {
            case "fetchRetryCount":
                // TODO: Possibly make this not affect the fetch count when the dialog was canceled instead of saved
                if (value === state.settings.fetchRetryCount) return;
                prevRetryCount = state.settings.fetchRetryCount;
                state.settings.fetchRetryCount = value;
                if (state.sentencesEl.childElementCount === 0 && value > prevRetryCount && value >= (state.fetchCount[state.currentUrl] ?? 0)) {
                    const data = await fetchImmersionKitData();
                    await renderSentences(data);
                }
                break;
            case "fetchRetryDelay":
                if (value === state.settings.fetchRetryDelay) return;
                state.settings.fetchRetryDelay = value;
                break;
        }
    }

    async function onMaxBoxHeightOptionChanged(name, value) {
        if (value === state.settings.maxBoxHeight) return;
        if (!Number.isNaN(Number(value))) {
            value += "px";
            state.settings.maxBoxHeight = wkof.settings[scriptId].maxBoxHeight = value;
        }
        const replacement = `$1 ${value};`;
        state.styleSheetEl.innerHTML = state.styleSheetEl.innerHTML.replace(maxHeightSearchRegex,replacement);
    }

    async function onShowOnKanjiOptionChanged(name, value) {
        if (value === state.settings.showOnKanji) return;
        state.settings.showOnKanji = value;
        setWaniKaniItemInfoListener();
    }

    async function onSettingsClosed(settings) {
        // Revert any modifications that were unsaved, or finalize any that were.
        await Promise.all([
            onShowOnKanjiOptionChanged('showOnKanji', settings.showOnKanji),
            onAudioPlaybackOptionChanged("playbackRate", settings.playbackRate),
            onAudioPlaybackOptionChanged("playbackVolume", settings.playbackVolume),
            onExampleLimitOptionChanged("exampleLimit", settings.exampleLimit),
            onFetchOptionChanged("fetchRetryCount", settings.fetchRetryCount),
            onFetchOptionChanged("fetchRetryDelay", settings.fetchRetryDelay),
            onMaxBoxHeightOptionChanged("maxBoxHeight", settings.maxBoxHeight),
            onTextShowOptionChanged('showJapanese', settings.showJapanese),
            onTextShowOptionChanged('showFurigana', settings.showFurigana),
            onTextShowOptionChanged('showEnglish', settings.showEnglish),
        ]);
    }

    async function onTextShowOptionChanged(name, value) {
        let selector;
        switch (name) {
            case "showEnglish":
                if (value === state.settings.showEnglish) return;
                state.settings.showEnglish = value;
                selector = '.example-text .en > span';
                break;
            case "showFurigana":
                if (value === state.settings.showFurigana) return;
                state.settings.showFurigana = value;
            // fallthrough
            case "showJapanese":
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
        state.content.selections = combineObjectsWithTrueValuesToSet(state.settings.filterAnimeShows, state.settings.filterAnimeMovies, state.settings.filterGhibli, state.settings.filterDramas, state.settings.filterGames, state.settings.filterLiterature, state.settings.filterNews);
    }

    function validateMaxHeight(value) {
        return value === undefined || value === null || value === "" || validCssUnitRegex.test(value) || 'Number and (optional) valid unit type only';
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

    async function createStyle() {
        state.styleSheetEl = document.createElement("style");
        state.styleSheetEl.setAttribute("id", styleSheetName);
        state.styleSheetEl.setAttribute("type", "text/css");
        // language=CSS
        state.styleSheetEl.innerHTML = `
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
#${scriptId} .hide { display: none; }
`;
        document.querySelector("head").append(state.styleSheetEl);
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
