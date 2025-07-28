document.addEventListener('DOMContentLoaded', () => {
    const gnhQuestions = [
        { id: 'q1', text: '今の気持ちは穏やかですか？', options: ['とてもそう思う', 'そう思う', 'どちらでもない', 'あまりそう思わない', '全くそう思わない'] },
        { id: 'q2', text: '今日一日、小さな幸せを感じましたか？', options: ['強く感じた', '少し感じた', 'どちらでもない', 'あまり感じなかった', '全く感じなかった'] },
        { id: 'q3', text: '自分自身を受け入れられていますか？', options: ['完全に受け入れている', '受け入れている', 'どちらでもない', 'あまり受け入れていない', '全く受け入れていない'] },
        { id: 'q4', text: '心に余裕がありますか？', options: ['とてもある', 'ある', 'どちらでもない', 'あまりない', '全くない'] },
        { id: 'q5', text: '未来に希望を感じますか？', options: ['強く感じる', '感じる', 'どちらでもない', 'あまり感じない', '全く感じない'] }
    ];

    const sections = {
        gnh: document.getElementById('gnhSection'),
        records: document.getElementById('recordsSection'),
        settings: document.getElementById('settingsSection'),
        about: document.getElementById('aboutSection')
    };

    const navButtons = {
        gnh: document.getElementById('showGNH'),
        records: document.getElementById('showRecords'),
        settings: document.getElementById('showSettings'),
        about: document.getElementById('showAbout')
    };

    const gnhQuestionsContainer = document.querySelector('.gnh-questions');
    const saveGNHButton = document.getElementById('saveGNH');
    const gnhResultDiv = document.getElementById('gnhResult');
    const recordListDiv = document.getElementById('recordList');
    const clearRecordsButton = document.getElementById('clearRecords');
    const notificationTimeInput = document.getElementById('notificationTime');
    const setNotificationButton = document.getElementById('setNotification');
    const userNameInput = document.getElementById('userName');
    const saveUserNameButton = document.getElementById('saveUserName');
    const settingsMessageDiv = document.getElementById('settingsMessage');
    const toggleMenuButton = document.getElementById('toggleMenu');
    const mainMenu = document.getElementById('mainMenu');

    let currentUserName = localStorage.getItem('userName') || '';
    if (userNameInput) {
        userNameInput.value = currentUserName;
    }

    // セクション表示切り替え関数
    function showSection(sectionId) {
        for (let key in sections) {
            sections[key].classList.remove('active-section');
            sections[key].classList.add('hidden-section');
        }
        sections[sectionId].classList.remove('hidden-section');
        sections[sectionId].classList.add('active-section');
        if (mainMenu) mainMenu.classList.add('hidden'); // メニューを閉じる
    }

    // GNH質問の動的生成
    if (gnhQuestionsContainer) {
        gnhQuestions.forEach(q => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('gnh-question-item');
            itemDiv.innerHTML = `<p>${q.text}</p><select id="${q.id}"></select>`;
            const select = itemDiv.querySelector('select');
            q.options.forEach((optionText, index) => {
                const option = document.createElement('option');
                option.value = 5 - index; // 5が最もポジティブ、1が最もネガティブ
                option.textContent = optionText;
                select.appendChild(option);
            });
            gnhQuestionsContainer.appendChild(itemDiv);
        });
    }

    // GNH記録の保存
    if (saveGNHButton) {
        saveGNHButton.addEventListener('click', () => {
            const answers = {};
            let totalScore = 0;
            gnhQuestions.forEach(q => {
                const select = document.getElementById(q.id);
                answers[q.id] = parseInt(select.value);
                totalScore += parseInt(select.value);
            });

            const record = {
                date: new Date().toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
                answers: answers,
                totalScore: totalScore
            };

            const records = JSON.parse(localStorage.getItem('gnhRecords')) || [];
            records.push(record);
            localStorage.setItem('gnhRecords', JSON.stringify(records));

            let message = '今日のあなたの心の羅針盤を記録しました。';
            if (totalScore >= 20) {
                message += ' とても素晴らしい状態ですね！この調子で、あなたらしい日々を過ごしてください。';
            } else if (totalScore >= 15) {
                message += ' 心穏やかな一日を過ごせているようです。小さな幸せを見つけるのが上手ですね。';
            } else if (totalScore >= 10) {
                message += ' 今日のあなたは、少し頑張りすぎたかもしれません。ゆっくり休む時間も大切ですよ。';
            } else {
                message += ' 今日のあなたは、少し疲れているようです。ココミチがそっと寄り添います。無理せず、深呼吸してみましょう。';
            }

            gnhResultDiv.textContent = message;
            gnhResultDiv.classList.add('show');
            setTimeout(() => gnhResultDiv.classList.remove('show'), 5000); // 5秒後にメッセージを消す
        });
    }

    // 記録の表示
    function displayRecords() {
        if (!recordListDiv) return;
        recordListDiv.innerHTML = ''; // 一度クリア
        const records = JSON.parse(localStorage.getItem('gnhRecords')) || [];

        if (records.length === 0) {
            recordListDiv.innerHTML = '<p>まだ記録がありません。今日の羅針盤を記録してみましょう。</p>';
            return;
        }

        records.sort((a, b) => new Date(b.date) - new Date(a.date)); // 最新のものが上に来るようにソート

        records.forEach(record => {
            const recordItem = document.createElement('div');
            recordItem.classList.add('record-item');
            let detailHtml = '';
            gnhQuestions.forEach(q => {
                const answerValue = record.answers[q.id];
                const optionText = q.options[5 - answerValue]; // 値から元のテキストを取得
                detailHtml += `<p><strong>${q.text}</strong>: ${optionText} (スコア: ${answerValue})</p>`;
            });

            recordItem.innerHTML = `
                <h3>${record.date} の記録 (合計スコア: ${record.totalScore})</h3>
                ${detailHtml}
            `;
            recordListDiv.appendChild(recordItem);
        });
    }

    // 全ての記録を削除
    if (clearRecordsButton) {
        clearRecordsButton.addEventListener('click', () => {
            if (confirm('全ての記録を削除してもよろしいですか？この操作は元に戻せません。')) {
                localStorage.removeItem('gnhRecords');
                displayRecords(); // 記録リストを更新
                alert('全ての記録が削除されました。');
            }
        });
    }

    // 通知時間の設定 (PWAのプッシュ通知はService Workerとサーバーサイドの連携が必要なため、ここではUIのみ)
    if (setNotificationButton) {
        setNotificationButton.addEventListener('click', () => {
            const time = notificationTimeInput.value;
            if (time) {
                localStorage.setItem('notificationTime', time);
                settingsMessageDiv.textContent = `毎日 ${time} に通知を設定しました。（※PWAの通知機能は、ブラウザとOSの設定に依存します。）`;
                settingsMessageDiv.classList.add('show');
                setTimeout(() => settingsMessageDiv.classList.remove('show'), 5000);
                // ここにService Worker経由での通知登録ロジックを実装（サーバーサイド必要）
                console.log(`Notification time set to: ${time}`);
            } else {
                settingsMessageDiv.textContent = '通知時間を入力してください。';
                settingsMessageDiv.classList.add('show');
                setTimeout(() => settingsMessageDiv.classList.remove('show'), 3000);
            }
        });
    }

    // ユーザー名の保存
    if (saveUserNameButton) {
        saveUserNameButton.addEventListener('click', () => {
            const newName = userNameInput.value.trim();
            if (newName) {
                localStorage.setItem('userName', newName);
                currentUserName = newName;
                settingsMessageDiv.textContent = `あなたの名前を「${newName}」として保存しました。`;
                settingsMessageDiv.classList.add('show');
                setTimeout(() => settingsMessageDiv.classList.remove('show'), 5000);
            } else {
                localStorage.removeItem('userName');
                currentUserName = '';
                settingsMessageDiv.textContent = '名前を削除しました。';
                settingsMessageDiv.classList.add('show');
                setTimeout(() => settingsMessageDiv.classList.remove('show'), 5000);
            }
        });
    }

    // ナビゲーションボタンのイベントリスナー
    if (navButtons.gnh) navButtons.gnh.addEventListener('click', () => showSection('gnh'));
    if (navButtons.records) navButtons.records.addEventListener('click', () => { showSection('records'); displayRecords(); });
    if (navButtons.settings) navButtons.settings.addEventListener('click', () => showSection('settings'));
    if (navButtons.about) navButtons.about.addEventListener('click', () => showSection('about'));

    // メニューのトグル
    if (toggleMenuButton) {
        toggleMenuButton.addEventListener('click', () => {
            mainMenu.classList.toggle('hidden');
        });
    }

    // 初期表示
    showSection('gnh'); // 最初にGNHセクションを表示
});
