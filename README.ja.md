# LLM GPU Toolkit

<p align="center"><img src="docs/images/logo/main_logo.jpg" alt="LLM GPU Toolkit" width="160"></p>

保存済みの Ollama モデル情報を参照し、概算VRAMとGPU容量を比較するツールです。計画の参考であり、実機ベンチマークや動作保証ではありません。

[English](README.en.md) | [简体中文](README.md) | [繁體中文（臺灣）](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

## 入口を選ぶ

| 入口 | 目的 |
| --- | --- |
| [静的な計算ページ](index.html) | 保存済みモデル・量子化・VRAM容量を選択 |
| [モデル設定](config.json) | 収集処理が参照する上流ページを確認 |
| [保存済みJSON](modeldata/cleaned/) | データの鮮度を確認 |
| [Reactソース](llm-vram-calc-web/) | 別のフロントエンド実装。ルートの静的ページとは区別 |

## ローカルで静的ページを開く

リポジトリのルートでローカル端末だけにバインドしたサーバーを起動し、http://127.0.0.1:8000 を開きます。既存ファイルを配信するだけで、モデル情報は更新しません。

```sh
git clone https://github.com/jammyfu/llm_gpu_toolkit.git
cd llm_gpu_toolkit
python3 -m http.server 8000 --bind 127.0.0.1
```

## 確認してからデータを更新

Python 3.8+ と仮想環境を使います。config.json と収集スクリプトを確認してから実行してください。上流ページへアクセスしてローカルJSONを書き込みます。現在、一部のリクエストでTLS証明書検証が無効になっているため、機密性の高い環境で使う前に確認・修正が必要です。このコマンドはモデルの重みをダウンロードしません。

```sh
python3 -m venv .venv
# Windows: .venv\Scripts\activate
. .venv/bin/activate
python -m pip install -r requirements.txt
python get_model.py
```

## 概算値の意味

ルートのページはGB/TB表記のファイルサイズを読み取り、FP16は2倍、Q8_0は1.5倍、その他（Q4_K_Mを含む）は1.2倍にし、最小値を0.5としています。コンテキスト長、KVキャッシュ、学習のオプティマイザー状態、特定の推論エンジンはモデル化していません。「実行可能」はこの簡易比較にすぎず、情報が古い場合もあります。これだけでハードウェア購入や複数GPUの学習容量を判断しないでください。

## 利用とライセンス

この版には LICENSE ファイルがありません。パッケージ分類にはMITとありますが、完全な利用許諾ではありません。再利用・再配布の前に権利を確認してください。この更新でライセンスを創作して追加することはありません。

## 詳しい資料

5言語の案内はアプリUIの5言語対応を意味しません。旧来の混在言語の技術資料は履歴として保存しており、導入手順が古い場合があります。

- [README.reference.md](README.reference.md)
- [CURRENT_PLAN.md](CURRENT_PLAN.md) · [PROJECT_BRIEF.md](PROJECT_BRIEF.md)
- [CONTRIBUTING.md](CONTRIBUTING.md) · [SECURITY.md](SECURITY.md)
- [Issues](https://github.com/jammyfu/llm_gpu_toolkit/issues)
