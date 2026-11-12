# LLM GPU Toolkit

<p align="center"><img src="docs/images/logo/main_logo.jpg" alt="LLM GPU Toolkit" width="160"></p>

瀏覽已儲存的 Ollama 模型資料，粗略比較預估顯示記憶體需求與 GPU 容量。這是選型參考，不是硬體實測，也不保證模型一定能執行。

[English](README.en.md) | [简体中文](README.md) | [繁體中文（臺灣）](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

## 選擇入口

| 入口 | 用途 |
| --- | --- |
| [靜態計算頁面](index.html) | 選擇已存模型、量化類型與顯示記憶體容量 |
| [模型設定](config.json) | 確認蒐集程式會請求哪些上游頁面 |
| [已蒐集 JSON](modeldata/cleaned/) | 先確認儲存的資料是否仍有效 |
| [React 原始碼](llm-vram-calc-web/) | 獨立前端原始碼，請勿與根目錄靜態頁面混淆 |

## 在本機執行靜態頁面

在儲存庫根目錄啟動僅繫結本機的伺服器，再開啟 http://127.0.0.1:8000。這只提供既有檔案，不會自動更新模型資料。

```sh
git clone https://github.com/jammyfu/llm_gpu_toolkit.git
cd llm_gpu_toolkit
python3 -m http.server 8000 --bind 127.0.0.1
```

## 確認後再更新資料

使用 Python 3.8+ 與虛擬環境，先檢查 config.json 和蒐集程式再執行。程式會存取上游頁面並寫入本機 JSON；目前部分請求停用了 TLS 憑證驗證，用於敏感環境前應先審查或修正。此命令不會下載模型權重。

```sh
python3 -m venv .venv
# Windows: .venv\Scripts\activate
. .venv/bin/activate
python -m pip install -r requirements.txt
python get_model.py
```

## 估算值的意義

根目錄頁面目前解析檔案大小的 GB/TB 文字，FP16 乘以 2、Q8_0 乘以 1.5，其他情況（含 Q4_K_M）乘以 1.2，最小值為 0.5。它並未模擬上下文長度、KV 快取、訓練最佳化器狀態或特定推論引擎。「可執行」標示只是這項粗略比較，資料也可能過時。請勿僅憑它購買硬體或承諾多張顯示卡的訓練容量。

## 使用與授權

此版本沒有 LICENSE 檔案。套件分類欄位雖標示 MIT，但並非完整授權；重複使用或散布前請先確認權利。本次更新不會自行新增授權條款。

## 延伸閱讀

五語導覽不代表應用程式介面支援五語。原本混合語言的技術文件保留為歷史參考，安裝建議可能已過時。

- [README.reference.md](README.reference.md)
- [CURRENT_PLAN.md](CURRENT_PLAN.md) · [PROJECT_BRIEF.md](PROJECT_BRIEF.md)
- [CONTRIBUTING.md](CONTRIBUTING.md) · [SECURITY.md](SECURITY.md)
- [Issues](https://github.com/jammyfu/llm_gpu_toolkit/issues)
