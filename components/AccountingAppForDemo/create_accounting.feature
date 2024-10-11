Feature: 新增支出

  Scenario: 新增一條娛樂支出
    Given 應用程序已啟動
    When 我點擊數字 "1", "2", "3"
    And 我點擊 "OK" 按鈕
    And 我選擇 "娛樂" 類別
    And 我再次點擊 "OK" 按鈕
    Then 我應該看到一條新的 "娛樂" 支出記錄
    And 該記錄的金額應該是 "$123"
    And 總金額應該增加 "$123"
