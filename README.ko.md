# LLM GPU Toolkit

<p align="center"><img src="docs/images/logo/main_logo.jpg" alt="LLM GPU Toolkit" width="160"></p>

저장된 Ollama 모델 정보를 살펴보고 대략적인 VRAM 요구량을 GPU 용량과 비교합니다. 계획을 돕는 도구이며 실측 벤치마크나 모델 실행 보증이 아닙니다.

[English](README.en.md) | [简体中文](README.md) | [繁體中文（臺灣）](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

## 용도별 시작점

| 시작점 | 용도 |
| --- | --- |
| [정적 계산 페이지](index.html) | 저장된 모델, 양자화 및 GPU 메모리 선택 |
| [모델 설정](config.json) | 수집기가 요청하는 원본 페이지 확인 |
| [수집된 JSON](modeldata/cleaned/) | 저장된 데이터의 최신성 확인 |
| [React 소스](llm-vram-calc-web/) | 별도 프런트엔드 소스이며 루트 정적 페이지와 구분 |

## 정적 페이지를 로컬에서 실행

저장소 루트에서 로컬 컴퓨터에만 바인딩된 서버를 실행하고 http://127.0.0.1:8000 을 엽니다. 기존 파일만 제공하며 모델 데이터는 자동 갱신하지 않습니다.

```sh
git clone https://github.com/jammyfu/llm_gpu_toolkit.git
cd llm_gpu_toolkit
python3 -m http.server 8000 --bind 127.0.0.1
```

## 확인 후 데이터 갱신

Python 3.8+와 가상 환경을 사용하세요. config.json과 수집기를 먼저 확인한 뒤 실행합니다. 원본 페이지에 요청하고 로컬 JSON을 기록합니다. 현재 일부 요청은 TLS 인증서 검증을 비활성화하므로 민감한 환경에서 사용하기 전에 검토하거나 수정하세요. 이 명령은 모델 가중치를 다운로드하지 않습니다.

```sh
python3 -m venv .venv
# Windows: .venv\Scripts\activate
. .venv/bin/activate
python -m pip install -r requirements.txt
python get_model.py
```

## 추정값의 의미

루트 페이지는 GB/TB 파일 크기 문자열을 읽어 FP16은 2배, Q8_0는 1.5배, 나머지(Q4_K_M 포함)는 1.2배로 계산하며 최솟값은 0.5입니다. 컨텍스트 길이, KV 캐시, 학습 옵티마이저 상태나 특정 추론 엔진은 모델링하지 않습니다. “실행 가능” 표시는 이 단순 비교 결과일 뿐이며 데이터도 오래되었을 수 있습니다. 이것만으로 하드웨어를 구매하거나 다중 GPU 학습 용량을 보장하지 마세요.

## 사용과 라이선스

이 버전에는 LICENSE 파일이 없습니다. 패키지 분류에 MIT라고 적혀 있지만 완전한 이용 허락을 대신하지 않습니다. 재사용·재배포 전에 권리를 확인하세요. 이번 수정에서 임의로 라이선스를 추가하지 않습니다.

## 자세한 자료

5개 언어 안내는 앱 UI가 5개 언어를 지원한다는 뜻이 아닙니다. 기존 혼합 언어 기술 문서는 이력으로 보존했으며 설치 방법이 오래되었을 수 있습니다.

- [README.reference.md](README.reference.md)
- [CURRENT_PLAN.md](CURRENT_PLAN.md) · [PROJECT_BRIEF.md](PROJECT_BRIEF.md)
- [CONTRIBUTING.md](CONTRIBUTING.md) · [SECURITY.md](SECURITY.md)
- [Issues](https://github.com/jammyfu/llm_gpu_toolkit/issues)
