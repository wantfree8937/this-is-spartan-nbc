# this-is-spartan-nbc


## 프로젝트 소개
### 배경
: 사람들에게 무차별적인 사냥을 당한 '몬스터'들이 우연히 발견한 석상의 힘으로 강해져서 사람들에게 대항하는 턴제 로그라이트 게임입니다.


## 프로젝트 구성
### 1. classes
: user, stat, tower, town 등 반복적으로 쓰이는 구조를 정의
### 2. config
: 중요 정보를 간단한 단어로 재정의
### 3. constants
: 중요 정보의 초기값 정의 및 handlerId와 Header를 정의
### 4. db
: db 구조 정의, db 내 정보 읽기, db 내 저장할 기본 정보 작성
### 5. events
: 클라이언트와 데이터 교환 
### 6. handlers
: 기능 구현
### 7. init
: 서버 열리기 전 초기 데이터 불러오기
### 8. protobuf
: 데이터 송수신 타이틀 및 payload 내용 정의
### 9. session
: 마을, 던전 등의 class 이용하는 함수 정의
### 10. utils
: packetParser, 에러핸들러 등 각종 부가기능 정의
### 11. server.js
: 게임 서버 시작 정의




## 기술 스택
### 1. mysql 
    : 데이터를 구조화된 방식으로 저장하고 관리하기 위해 사용하는 오픈 소스 관계형 데이터 베이스로 게임의 기본적인 데이터를 안전하게 저장하기 위해서 사용

### 2. Redis
    : 메모리 기반의 오픈 소스 데이터 구조를 가진 비관계형 데이터 베이스로 게임의 기본적인 데이터를 Mysql로부터 받아와 빠르게 이용하기 위해서 사용
### 2. Net
    : NodeJs에서 Tcp 소켓을 사용해 네트워크 통신을 구현하는 내장 모듈로 유저와 서버 간 통신을 주고 받기 위해서 사용
### 2. Protobufjs
    : Google에서 제공하는 Protocol Buffers를 자바스크립트에서 읽고 데이터를 직렬화 및 역직렬화하는 기능을 제공하는 라이브러리로 유저와 서버간 제공할 데이터를 직렬화해서 데이터를 효율적으로 보낼 수 있게 하고 역직렬화해서 읽을 수 있는 데이터로 변경하기 위해서 사용
### 2. lodash
    : db에서 오는 배열 혹은 객체 데이터를 carmel case로 변경하기 위해서 사용
### 2. uuid
    : 유저의 각 캐릭터 별로 고유 식별자를 제공해서 구분하기 위해서 사용


## 기능
### 1. Town
    - Enter 
        # 게임접속 후 마을에 입장하거나 던전에서 나와 마을에 돌아올 때 사용됩니다.
        # 유저 정보와 최종보스 클리어 정보를 담습니다.
        
    - Spawn 
        # 캐릭터가 마을에 등장할 때마다 사용됩니다.
        # 유저 정보를 담습니다.

    - Move 
        # 캐릭터가 움직일 때 사용됩니다.
        # 유저 ID와 좌표 정보를 담습니다.

    - Chat 
        # 다른 유저와 채팅을 칠 때 사용합니다.
        # 유저 ID와 채팅내용을 담습니다.

    - Animation 
        # 캐릭터 애니메이션을 할 때 사용합니다.
        # 유저 ID와 애니메이션 코드를 담습니다.

    - Despawn 
        # 캐릭터가 마을에서 퇴장할 때 사용합니다.
        # 유저 ID를 담습니다.

### 2. Dungeon
    - Enter 
        # 던전 입장 시 사용합니다.
        # 던전 정보, 유저 정보, 입장문구, 배틀로그를 담습니다.

    - Screen Text 
        # 입장문구로 사용합니다.
        # 입장문구 내용을 담습니다.

    - Screen Done 
        # 입장 문구를 닫을 때 사용합니다.
        
    - Battle Log 
        # 전투 상태를 전달할 때 사용합니다.
        # 던전에서 여러 기능의 버튼을 활성화/비활성화 하는데 사용합니다.
        # 상태 내용, 버튼 명, 활성화 상태 를 담습니다.

    - Set Player Hp 
        # 유저 Hp 최신화에 사용합니다.
        # 유저 Hp 정보를 담습니다.

    - Set Player Mp 
        # 유저 Mp 최신화에 사용합니다
        # 유저 Mp 정보를 담습니다.

    - Set Monster Hp 
        # 몬스터 Hp 최신화에 사용합니다
        # 몬스터 Hp 정보를 담습니다.

    - Player Action 
        # 유저의 공격, 피격, 죽음 모션에 사용합니다.
        # 타켓 몬스터정보와 액션스타일을 담습니다.

    - Monster Action 
        # 몬스터의 공격, 피격, 죽음 모션에 사용합니다.
        # 해당 몬스터정보와 액션스타일을 담습니다.

    - Player Item 
        # 유저가 던전에서 몬스터를 무찌르면서 얻은 재화를 최신화하는데 사용합니다.
        # 영혼과 코인 정보를 담습니다.

    - Leave 
        # 던전에서 퇴장하는데 사용합니다


### 3. Tower
    - Player Upgrade 
        # 유저를 강화하는데 사용합니다
        # 유저 정보, 업그레이드되는 레벨, 다음 레벨, 소울 정보를 담습니다.

### 4. Other Info
    - Login 
        # 로그인하는데 사용합니다.
        # 잠금여부 정보, 코인, 가능여부 정보를 담습니다.

    - Unlock Character 
        # 캐릭터를 해금하는데 사용합니다.
        # 캐릭터 정보, 코인을 담습니다.

    - Connect 
        # 연결하는데 사용합니다.

    - Register 
        # 회원가입 후 등록하는데 사용합니다.
        # 회원가입 성공 여부를 담습니다.

    - Player Sound 
        # 유저의 공격, 피격, 죽음 모션에 적절한 음악을 사용합니다.
        # 타켓 몬스터정보와 액션스타일을 담습니다.
    

## 주요 기능 흐름
### 1. 마을 입장 시
Town Enter ➺ Town Spawn

### 2. 던전 입장시
Dungeon Enter ➺ Screen Text ➺ Screen Done

### 3. 던전에서 전투시
3.1. 캐릭터 공격 시 :  
Battle Log ➺ Player Action ➺ (스킬 사용 시 Set Player Mp ) ➺ Set Monster Hp   

3.2. 몬스터 공격 시 :  
Monster Action ➺ Set Player Hp ➺ Battle Log

### 4. 업그레이드 시
Player Upgrade ➺ Player Item
   
## 기타
### 1. 개발 기간
: 2024년 8월 3일 ~ 8월 22일 (20일)

### 2. 개발자 소개
박승엽(팀장), 김동규, 민광규, 전우찬

### 3. 개발 환경
vscode, nodeJs, Unity

### 4. 프로젝트 프로그램 설치방법
npm install 입력  
: dotenv, lodash, mysql2, protobufjs, redis, uuid + nodemon, prettier  

#참고 사항#  
프로그램 버전 :  
    dotenv      : 16.4.5  
    lodash      : 4.17.21  
    long        : 5.2.3  
    mysql2      : 3.10.3  
    protobufjs  : 7.3.2  
    redis       : 4.7.0  
    uuid        : 10.0.0  
    nodemon     : 3.1.4  
    prettier    : 3.3.3  

### 5. 프로젝트 사용법
1. 서버 오픈하기  
: [npm run dev] or [npm run start]
  
2. db 스키마 생성  
: 혹시 이미 같은 이름이 존재한다면 mysql에 들어가서 상위 폴더에서 마우스 우클릭 후 [New Query] 클릭  
[DELETE DATABASE '데이터베이스 명'] 후 마우스 우클릭 [run mysql query] 클릭  
[CREATE DATABASE '데이터베이스 명'] 후 마우스 우클릭 [run mysql query] 클릭  
터미널에서 [npm run migrate] 입력 후 엔터치면 스키마가 생성됩니다.