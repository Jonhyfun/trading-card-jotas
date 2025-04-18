/*
    
      const tmpUser = {
        points: [],
        cardStack: [],
        cardVisualEffects: [],
        ip: "TESTE",
      } as Partial<PlayerType>;
    
    
    ([
    "tilde",
      "slash",
      "slash",
      "slash",
      "exclamation",
      "slash",
      "ten",
      "x",
      "ten",
      "exclamation",
      "tilde",
      "tilde",
      "ten",
      "slash";
    ] as Cards[]).forEach((card, i) => {
      tmpUser.cardStack!.push({ cardKey: card, id: `card-${i}` })
    
      const parsedCards = tmpUser.cardStack!.map(({ cardKey }) => CardsObject[cardKey].default)
    
      tmpUser.points!.push(handlePointsSum(tmpUser as PlayerType, parsedCards))
      handleVisualEffects(tmpUser as PlayerType, parsedCards)
    
      console.log(tmpUser.points)
      console.log(tmpUser.cardVisualEffects)
    })
    console.log(evaluate('-4 -3 +10 -4 +1 +5 +10'))

    const userA = deepCopy(
      getMockConnectedUser(
        "TEST",
        "TEST-USER-A",
        Array.from({ length: 20 }).map((_, i) => ({
          cardKey: "ten",
          id: `NEW-CARD-A-${i}`,
        }))
      )
    ) as ConnectedSocket;
    const userB = deepCopy(
      getMockConnectedUser(
        "TEST",
        "TEST-USER-B",
        Array.from({ length: 20 }).map((_, i) => ({
          cardKey: "ten",
          id: `NEW-CARD-B-${i}`,
        }))
      )
    ) as ConnectedSocket;
    setRooms(() => ({ ["TEST"]: [userA, userB] }));

    onUserSetCard(userA, { cardKey: "one", id: "NEW-CARD-A" });
    onUserSetCard(userB, { cardKey: "slash", id: "NEW-CARD-B" });

    onUserSetCard(userA, { cardKey: "two", id: "NEW-CARD-A-2" });
    onUserSetCard(userB, { cardKey: "zero", id: "NEW-CARD-B-2" });

    onUserSetCard(userA, { cardKey: "asterisk", id: "NEW-CARD-A-3" });
    onUserSetCard(userB, { cardKey: "two", id: "NEW-CARD-B-3" });

    onUserSetCard(userA, { cardKey: "zero", id: "NEW-CARD-A-4" });
    onUserSetCard(userB, { cardKey: "asterisk", id: "NEW-CARD-B-4" });

    onUserSetCard(userA, { cardKey: "one", id: "NEW-CARD-A-4" });
    onUserSetCard(userB, { cardKey: "ten", id: "NEW-CARD-B-4" });

    console.log(userA.cardStack.map(({ cardKey }) => cardKey));
    console.log(userB.cardStack.map(({ cardKey }) => cardKey));
    */
