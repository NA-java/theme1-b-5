// =================================
// 1. HTMLの要素を取得　関数定義
// =================================

const addButton = document.getElementById("add-button");
const serviceInput = document.getElementById("service-input");
const updateInput = document.getElementById("update-input");

const serviceList = document.getElementById("service-list");
const reminderList = document.getElementById("reminder-list");


// =================================
// 2. サービス情報を保存する配列　サービスを一元管理するため
// =================================

const services = [];


// =================================
// 3. 登録ボタンの処理　サービス名・更新日を取得
// =================================

addButton.addEventListener("click", () => {

    // 入力された情報を取得　
    const serviceName = serviceInput.value.trim();
    const update = updateInput.value;

    // 未入力チェック　なくてもいいかも
    if (serviceName === "" || update === "") {
        alert("サービス名と更新日を入力してください");
        return;
    }

        // 今日の日付を取得
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 入力された更新日を取得
    const inputDate = new Date(update);

    // 過去の日付かチェック
    if (inputDate < today) {
        alert("過去の日付です！");
     return;
    }

    // サービス情報を作成
    const service = {
        name: serviceName,
        updateDate: update
    };

    // 配列に登録
    services.push(service);

    // 2つのリストを更新
    displayServices();
    displayReminders();

    // 入力欄をリセット
    serviceInput.value = "";
    updateInput.value = "";

});


// =================================
// 4. 登録サービス一覧の表示
// =================================

function displayServices() {

    // リストを一度空にする
    serviceList.innerHTML = "";

    // 登録されたサービスを順番に表示
    services.forEach(function(service, index) {

        const li = document.createElement("li");

        li.textContent =
            service.name + " ：更新日 " + service.updateDate;

        // 削除ボタンを作成
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "削除";

        // 削除ボタンの処理
        deleteButton.addEventListener("click", function() {

            // 配列から該当するサービスを削除
            services.splice(index, 1);

            // 2つのリストを更新
            displayServices();
            displayReminders();

        });

        // リストに削除ボタンを追加
        li.appendChild(deleteButton);

        serviceList.appendChild(li);

    });
}


// =================================
// 5. 更新日が近いサービスの表示
// =================================

function displayReminders() {

    // リストを一度空にする
    reminderList.innerHTML = "";

    // 今日の日付を取得
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 更新日が7日以内のサービスを抽出
    const reminders = services.filter(function(service) {

        const [year, month, day] = service.updateDate.split("-").map(Number);
        const updateDate = new Date(year, month - 1, day);
        const diff = updateDate - today;

        const remainingDays = Math.round(
            diff / (1000 * 60 * 60 * 24)
        );

        // 7日以内ならtrue
        return remainingDays >= 0 && remainingDays <= 7;

    });


  // 抽出したサービスを表示　
reminders.forEach(function(service) {

    const li = document.createElement("li");

// 更新日の情報を年、月、日の3つに分けて配列へ代入
    const [year, month, day] = service.updateDate.split("-").map(Number);
    const updateDate = new Date(year, month - 1, day);

// サブスク終了までの日にちを計算
    const remainingDays = Math.round(
        (updateDate - today) / (1000 * 60 * 60 * 24)
    );

    li.textContent =
        service.name + " ：あと" + remainingDays + "日";

    reminderList.appendChild(li);

});
}


// =================================
// 6. ページ読み込み時のアニメーション
// =================================

window.addEventListener("load", function() {

    document.body.animate(
        [
            { opacity: 0 },
            { opacity: 1 }
        ],
        {
            duration: 1500,
            easing: "ease",
            fill: "forwards"
        }
    );

});


// =================================
// 7. 更新日を過ぎたサービスの表示
// =================================

function displayExpired() {

    // リストを一度空にする
    expiredList.innerHTML = "";

    // 今日の日付を取得
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 更新日を過ぎたサービスを抽出
    const expiredServices = services.filter(function(service) {

        const [year, month, day] =
            service.updateDate.split("-").map(Number);

        const updateDate = new Date(year, month - 1, day);

        // 今日より前ならtrue
        return updateDate < today;

    });

    // 抽出したサービスを表示
    expiredServices.forEach(function(service) {

        const li = document.createElement("li");

        li.textContent =
            service.name + " ：更新期限切れ";

        expiredList.appendChild(li);

    });

}