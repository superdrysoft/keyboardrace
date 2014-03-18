Meteor.startup(function () {
  if (Aggregates.find().count() === 0) {
    Aggregates.insert({ '_id': 'averages', 'cpm': 0, 'wpm': 0, 'accuracy': 0 });
  }

  if (Paragraphs.find().count() === 0) {
    var paragraphs = [
      {
        "content" : "People who succeed have momentum. The more they succeed, the more they want to succeed, and the more they find a way to succeed. Similarly, when someone is failing, the tendency is to get on a downward spiral that can even become a self-fulfilling prophecy.",
        "language" : "en",
        "type" : "quote",
        "title":  null,
        "author": "Tony Robbins",
        "reference": "http://addicted2success.com/interviews/video-the-amazing-life-of-tony-robbins-the-1-peak-performance-coach"
      },

      {
        "content" : "Remembering that you are going to die is the best way I know to avoid the trap of thinking you have something to lose. You are already naked. There is no reason not to follow your heart.",
        "language" : "en",
        "type" : "quote",
        "title":  null,
        "author": "Steve Jobs",
        "reference": "http://en.wikipedia.org/wiki/Steve_Jobs"
      },

      {
        "content" : "I think if you do something and it turns out pretty good, then you should go do something else wonderful, not dwell on it for too long. Just figure out what's next.",
        "language" : "en",
        "type" : "quote",
        "title":  null,
        "author": "Steve Jobs",
        "reference": "http://en.wikipedia.org/wiki/Steve_Jobs"
      },

      {
        "content" : "If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it. And like any great relationship, it just gets better and better as the years roll on.",
        "language" : "en",
        "type" : "quote",
        "title":  null,
        "author": "Steve Jobs",
        "reference": "http://en.wikipedia.org/wiki/Steve_Jobs"
      },

      {
        "content" : "That's been one of my mantras - focus and simplicity. Simple can be harder than complex. You have to work hard to get your thinking clean to make it simple. But it's worth it in the end because once you get there, you can move mountains.",
        "language" : "en",
        "type" : "quote",
        "title":  null,
        "author": "Steve Jobs",
        "reference": "http://en.wikipedia.org/wiki/Steve_Jobs"
      },

      {
        "content" : "We are just an advanced breed of monkeys on a minor planet of a very average star. But we can understand the Universe. That makes us something very special.",
        "language" : "en",
        "type" : "quote",
        "title":  null,
        "author": "Stephen Hawking",
        "reference": "http://en.wikipedia.org/wiki/Stephen_Hawking"
      },

      {
        "content": "Gonna take your mama out all night. Yeah we'll show her what it's all about. We'll get her jacked up on some cheap champagne. We'll let the good times all roll out.",
        "language" : "en",
        "type" : "lyric",
        "title":  "Take Your Mama",
        "author": "Scissor Sisters",
        "reference": "http://www.scissorsisters.com"
      },

      {
        "content" : "I have eaten the plums that were in the icebox and which you were probably saving for breakfast. Forgive me. They were delicious, so sweet and so cold.",
        "language" : "en",
        "type" : "poem",
        "title" : "This Is Just To Say",
        "author" : "William Carlos Williams",
        "reference" : "http://www.amazon.com/William-Carlos-Williams-Selected-American/dp/1931082715/ref=sr_1_1?ie=UTF8&qid=1385424338&sr=8-1&keywords=William+Carlos"
      },

      {
        "content" : "Today is gonna be the day that they're gonna throw it back to you. By now you should've somehow realized what you gotta do. I don't believe that anybody feels the way I do about you now.",
        "language" : "en",
        "type" : "lyric",
        "title" : "Wonderwall",
        "author" : "Oasis",
        "reference" : "http://www.oasisinet.com"
      },

      {
        "content" : "We lay on the bed there kissing just for practice. Could we please be objective because the other boys are queuing up behind us.",
        "language" : "en",
        "type" : "lyric",
        "title" : "Seeing Other People",
        "author" : "Belle and Sebastian",
        "reference" : "http://en.wikipedia.org/wiki/Belle_and_Sebastian"
      },

      {
        "content" : "Judy, let's go for a walk. We can kiss and do whatever you want, but you will be disappointed. You will fall asleep with ants in your pants.",
        "language" : "en",
        "type" : "lyric",
        "title" : "Judy and the Dream of Horses",
        "author" : "Belle and Sebastian",
        "reference" : "http://en.wikipedia.org/wiki/Belle_and_Sebastian"
      },

      {
        "content" : "Make a new cult every day to suit your affairs. Kissing girls in English at the back of the stairs. You're a honey with a following of innocent boys. They never know it because you never show it",
        "language" : "en",
        "type" : "lyric",
        "title" : "The Stars of Track and Field",
        "author" : "Belle and Sebastian",
        "reference" : "http://en.wikipedia.org/wiki/Belle_and_Sebastian"
      },

      {
        "content" : "I love you. I am who I am because of you. You are every reason, every hope, and every dream I've ever had, and no matter what happens to us in the future, everyday we are together is the greatest day of my life. I will always be yours.",
        "language" : "en",
        "type" : "movie",
        "title" : "The Notebook",
        "author" : "Nick Cassavetes",
        "reference" : "http://en.wikipedia.org/wiki/The_Notebook_(2004_film)"
      },

      {
        "content" : "I'm scared of everything. I'm scared of what I saw. I'm scared of what I did, of who I am... and most of all, I'm scared of walking out of this room and never feeling the rest of my whole life the way I feel when I'm with you.",
        "language" : "en",
        "type" : "movie",
        "title" : "Dirty Dancing",
        "author" : "Emile Ardolino",
        "reference" : "http://en.wikipedia.org/wiki/Dirty_Dancing"
      },

      {
        "content" : "There is no such thing as equality for some. Equality must be for all. That is what freedom is. That is what liberty is. No human being is born more or less important than any other. How can we allow ourselves to forget that? What simpler truth is there?",
        "language" : "en",
        "type" : "book",
        "title" : "Wide Awake",
        "author" : "David Levithan",
        "reference" : "http://en.wikipedia.org/wiki/Wide_Awake_(novel)"
      },

      {
        "content" : "One time, when I was very little, I climbed a tree and ate these green, sour apples. My stomach swelled and became hard like a drum, it hurt a lot. Mother said that if I'd just waited for the apples to ripen, I wouldn't have become sick. So now, whenever I really want something, I try to remember what she said about the apples.",
        "language" : "en",
        "type" : "book",
        "title" : "The Kite Runner",
        "author" : "Khaled Hosseini",
        "reference" : "http://en.wikipedia.org/wiki/The_Kite_Runner"
      },

      {
        "content" : "Don't ever let them tell you that you're too stupid to do something. I'm not saying it's going to be easy for you. Maybe you're going to have to work for it a little harder than other people, which I know isn't fair. But that doesn't mean you should just give up.",
        "language" : "en",
        "type" : "book",
        "title" : "Abandon",
        "author" : "Meg Cabot",
        "reference" : "http://www.megcabot.com/abandon/"
      },

      {
        "content" : "Imagining the future is a kind of nostalgia. You spend your whole life stuck in the labyrinth, thinking about how you'll escape it one day, and how awesome it will be, and imagining that future keeps you going, but you never do it. You just use the future to escape the present.",
        "language" : "en",
        "type" : "book",
        "title" : "Looking for Alaska",
        "author" : "John Green",
        "reference" : "http://en.wikipedia.org/wiki/Looking_for_Alaska"
      },

      {
        "content" : "Sometimes, I look outside, and I think that a lot of other people have seen this snow before. Just like I think that a lot of other people have read those books before. And listened to those songs. I wonder how they feel tonight.",
        "language" : "en",
        "type" : "book",
        "title" : "The Perks Of Being A Wallflower",
        "author" : "Stephen Chbosky",
        "reference" : "http://en.wikipedia.org/wiki/The_Perks_of_Being_a_Wallflower"
      },

      {
        "content" : "A person who has good thoughts cannot ever be ugly. You can have a wonky nose and a crooked mouth and a double chin and stick-out teeth, but if you have good thoughts they will shine out of your face like sunbeams and you will always look lovely.",
        "language" : "en",
        "type" : "book",
        "title" : "The Twits",
        "author" : "Roald Dahl",
        "reference" : "http://en.wikipedia.org/wiki/The_Twits"
      },

      {
        "content" : "A jailer led him down the long corridor while another walked behind him to the right, pressing a rifle muzzle up against his ribs. An identical gray metal door with an identical small opening fronted each cell, the only differences being the Arabic numbers above the doors and the faces looking out through the tiny openings.",
        "language" : "en",
        "type" : "book",
        "title" : "The Garlic Ballads",
        "author" : "Mo Yan",
        "reference" : "http://www.goodreads.com/book/show/251392.The_Garlic_Ballads"
      },

      {
        "content" : "A jailer led him down the long corridor while another walked behind him to the right, pressing a rifle muzzle up against his ribs. An identical gray metal door with an identical small opening fronted each cell, the only differences being the Arabic numbers above the doors and the faces looking out through the tiny openings.",
        "language" : "en",
        "type" : "book",
        "title" : "The Garlic Ballads",
        "author" : "Mo Yan",
        "reference" : "http://www.goodreads.com/book/show/251392.The_Garlic_Ballads"
      },

      {
        "content" : "\"There's a place available for someone on an expedition to the Alto Maranon that's been organized by the Institute of Linguistics for a Mexican anthropologist,\" she said to me one day when I ran into her on the campus of the Faculty of Letters. \"Would you like to go?\"",
        "language" : "en",
        "type" : "book",
        "title" : "The Storyteller",
        "author" : "Mario Vargas Llosa",
        "reference" : "http://en.wikipedia.org/wiki/The_Storyteller_(novel)"
      },

      {
        "content" : "There was also a well. Miss Spink and Miss Forcible made a point of telling Coraline how dangerous the well was, on the first day Coraline's family moved in, and warned her to be sure she kept away from it. So Coraline set off to explore for it, so that she knew where it was, to keep away from it properly.",
        "language" : "en",
        "type" : "book",
        "title" : "Coraline",
        "author" : "Neil Gaiman",
        "reference" : "http://www.readersread.com/excerpts/coraline.htm"
      },

      {
        "content" : "The brilliance of the full moon penetrated the darkest depths of the wood that gripped the tops of the cliffs. A small, darkly clad figure in a frock coat and knee boots stumbled along, carrying a long black leather case, timidly following a tall, confident man with long flowing white hair.",
        "language" : "en",
        "type" : "book",
        "title" : "Shadowmancer",
        "author" : "G. P. Taylor",
        "reference" : "http://www.readersread.com/excerpts/shadowmancer.htm"
      },

      {
        "content" : "One Sunday, while visiting with her grandparents, Kate noted that her grandpa was repeating the same stories. He kept asking the same questions over and over. And when she asked him about his day, he couldn't seem to remember what he'd done.",
        "language" : "en",
        "type" : "book",
        "title" : "What's Happening to Grandpa?",
        "author" : "Maria Shriver",
        "reference" : "http://www.readersread.com/excerpts/whatshappeningtograndpa.htm"
      },

      {
        "content" : "Nobody lived on Deadweather but us and the pirates. It wasn't hard to understand why. For one thing, the weather was atrocious. Eleven months out of twelve, it was brutally hot and humid, with no wind at all, so on a bad day the air felt like a hot, soggy blanket smothering you from all sides.",
        "language" : "en",
        "type" : "book",
        "title" : "Deadweather and Sunrise",
        "author" : "John Barnes",
        "reference" : "http://www.us.penguingroup.com/static/packages/us/yreaders/books4boys/excerpts.php"
      },

      {
        "content" : "His room was almost indestructible. So instead of trying to punch his way through the solid concrete above his head, he reached up and pulled himself into a corner of the ceiling, his arms and legs straining hard as he braced himself. His muscles shook but held as he stared down at the doorway and waited patiently.",
        "language" : "en",
        "type" : "book",
        "title" : "Subject Seven",
        "author" : "James A. Moore",
        "reference" : "http://www.us.penguingroup.com/static/packages/us/yreaders/books4boys/excerpts_subjectseven.php"
      },

      {
        "content" : "Most people don't panic when paid a lot of money for a simple job. I didn't use to panic either. That was before Jake disappeared, taking with him my mind-skill to understand and influence animals' thoughts, and taking my livelihood along with it.",
        "language" : "en",
        "type" : "book",
        "title" : "The Dragon Whisperer",
        "author" : "K.C. Shaw",
        "reference" : "http://www.ebooks.com/647567/the-dragon-whisperer/shaw-k-c/"
      },

      {
        "content" : "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세",
        "language" : "ko",
        "type" : "노래",
        "title" : "애국가",
        "author" : "안익태",
        "reference" : "http://ko.wikipedia.org/wiki/%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD%EC%9D%98_%EA%B5%AD%EA%B0%80"
      },

      {
        "content" : "칼을 강물에 떨어뜨리자 뱃전에 그 자리를 표시했다가 나중에 그 칼을 찾으려 한다는 뜻으로 어리석고 미련하여 융통성이 없음을 가리킴",
        "language" : "ko",
        "type" : "사자성어",
        "title" : "각주구검",
        "author" : null,
        "reference" : null
      },

      {
        "content" : "양홍의 아내가 밥상을 들어 눈썹과 나란히 하여 남편 앞에 놓았다는 데서 유래한 말로, 아내가 남편을 깍듯이 공경함을 말함",
        "language" : "ko",
        "type" : "사자성어",
        "title" : "거안제미",
        "author" : null,
        "reference" : null
      },

      {
        "content" : "그렇게 하얗고 노란 두 종류의 빛에 의지하여 그는 자기가 누워 있는 잔디밭 너머로 줄지어 늘어선 우아한 아치 기둥들과 그 위로 기어오르는 덩굴식물들을 볼 수 있었다. 그리고 보이지는 않았지만 그 너머 어딘가에서 졸졸거리며 조용히 흘러 가는 물소리도 들려왔다. 너무도 아름답고 근사한 광경이었다.",
        "language" : "ko",
        "type" : "소설",
        "title" : "하울의 움직이는 성 (Howl's Moving Castle)",
        "author" : "다이애나 윈 존스(Diana Wynne Jones)",
        "reference" : "http://mirror.enha.kr/wiki/%ED%95%98%EC%9A%B8%EC%9D%98%20%EC%9B%80%EC%A7%81%EC%9D%B4%EB%8A%94%20%EC%84%B1"
      },

      {
        "content" : "이윽고 이슬 방울들이 똑똑 떨어지는 커다란 고사리를 닮은 덤불 너머에서 마침내 물을 찾아냈는데, 그것은 또 하나의 잔디밭에 서 있는 수수한 대리석 분수대였다. 덤불에 줄줄이 걸려있는 불들이 분수대를 비추었고, 졸졸 흐르는 물은 바치 금빛과 은빛의 초승달들이 흘러가는 듯 경이로운 광경이었다. 압둘라는 넋을 잃고 그쪽으로 걸어갔다.",
        "language" : "ko",
        "type" : "소설",
        "title" : "하울의 움직이는 성 (Howl's Moving Castle)",
        "author" : "다이애나 윈 존스(Diana Wynne Jones)",
        "reference" : "http://mirror.enha.kr/wiki/%ED%95%98%EC%9A%B8%EC%9D%98%20%EC%9B%80%EC%A7%81%EC%9D%B4%EB%8A%94%20%EC%84%B1"
      },

      {
        "content" : "그녀는 촉촉이 젖은 풀을 맨발로 사뿐사뿐 밟으며 다가왔다. 그녀의 얇고 하늘하늘한 옷은 압둘라가 상상했던 공주처럼 사뭇 날씬하면서도 여위지 않은 몸매를 그대로 보여주고 있었다. 그러나 가까이 다가왔을 때 보니 얼굴은 상상 속의 공주처럼 완벽한 달걀 모양이 아니었고, 눈도 커다랗고 까맣기는 했지만 결코 몽롱하지 않았다.",
        "language" : "ko",
        "type" : "소설",
        "title" : "하울의 움직이는 성 (Howl's Moving Castle)",
        "author" : "다이애나 윈 존스(Diana Wynne Jones)",
        "reference" : "http://mirror.enha.kr/wiki/%ED%95%98%EC%9A%B8%EC%9D%98%20%EC%9B%80%EC%A7%81%EC%9D%B4%EB%8A%94%20%EC%84%B1"
      },

      {
        "content" : "낮에는 따사로운 인간적인 여자. 커피 한잔에 여유를 아는 품격 있는 여자. 밤이 오면 심장이 뜨거워지는 여자. 그런 반전있는 여자. 나는 사나이 낮에는 너만큼 따사로운 이런 사나이. 커피 식기도전에 원샷 때리는 사나이. 밤이오면 심장이 터져버리는 사나이 이런 사나이",
        "language" : "ko",
        "type" : "노래",
        "title" : "강남스타일",
        "author" : "싸이(Psy)",
        "reference" : "http://ko.wikipedia.org/wiki/%EA%B0%95%EB%82%A8%EC%8A%A4%ED%83%80%EC%9D%BC"
      },

      {
        "content" : "강나루 건너서 밀밭 길을 구름에 달 가듯이 가는 나그네. 길은 외줄기 남도 삼백 리, 술 익는 마을마다 타는 저녁 놀. 구름에 달 가듯이 가는 나그네.",
        "language" : "ko",
        "type" : "시",
        "title" : "나그네",
        "author" : "박목월",
        "reference" : "http://ko.wikipedia.org/wiki/%EB%B0%95%EB%AA%A9%EC%9B%94"
      },

      {
        "content" : "어디든 멀찌감치 통한다는 길 옆 주막 그 수없이 입술이 닿은 이 빠진 낡은 사발에 나도 입술을 댄다. 흡사 정처럼 옮아 오는 막걸리 맛. 여기 대대로 슬픈 노정이 집산하고 알맞은 자리, 저만치 위엄 있는 송덕비 위로 맵고도 쓴 시간이 흘러가고. 세월이여! 소금보다 짜다는 인생을 안주하여 주막을 나서면, 노을 비낀 길은 가없이 길고 가늘더라만, 내 입술이 닿은 그런 사발에 누가 또한 닿으랴 이런 무렵에.",
        "language" : "ko",
        "type" : "시",
        "title" : "주막에서",
        "author" : "김용호",
        "reference" : "http://terms.naver.com/entry.nhn?docId=552952&cid=1616&categoryId=1616"
      },

      {
        "content" : "세상의 친절함이라고는 하나도 없었을 때, 생명은 구해지고 새로운 새대가 탄생했습니다. 그것이 바로 이 이야기의 핵심입니다. 단 한명의 인간이 변화를 가져올 수 있다는 것이죠.",
        "language" : "ko",
        "type" : "영화",
        "title" : "쉰들러 리스트 (Schindler's List)",
        "author" : "스티븐 스필버그 (Steven Spielberg)",
        "reference" : "http://ko.wikipedia.org/wiki/%EC%89%B0%EB%93%A4%EB%9F%AC_%EB%A6%AC%EC%8A%A4%ED%8A%B8"
      },

      {
        "content" : "위대한 일을 하는 유일한 방법은 바로 여러분이 하는 일을 사랑하는 겁니다. 만약에 여러분이 사랑하는 일을 찾지 못했다면 계속 찾아보십시오. 안주하지 마세요. 여러분이 진정으로 사랑하는 일을 찾게 되면 마음으로 하는 모든 일들이 늘 그렇듯이 여러분은 확실히 알 수 있게 될 것입니다.",
        "language" : "ko",
        "type" : "명언",
        "title" : "2005년 스탠포드 대학교 연설",
        "author" : "스티브 잡스 (Steve Jobs)",
        "reference" : "http://www.youtube.com/watch?v=J-6DErrnqS0"
      }
    ];
    for (var i = 0; i < paragraphs.length; i++) {
      Paragraphs.insert(paragraphs[i]);
    }
  }
});