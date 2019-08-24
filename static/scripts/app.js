var app = angular.module("app", []);

app.controller("body",
    [
        "$scope",
        "$sce",
        "$filter",
        "$interval",
        function($scope, $sce, $filter, $interval)
        {
            $scope.room = {
                "id": "00a9ff",
                "name": "Tom, Dick, and Harry's Funtime Extravaganza",
                "host": 1095632,
                "currentSpeaker": 4294712,
                "nextTurn": new Date().getTime() + 10000,
                "participants": [
                    1095632,
                    4294712,
                    7728621
                ]
            };

            $scope.users = {
                "1095632": {
                    "name": "Tom",
                    "id": 1095632,
                    "imageUrl": "https://photos.laineygossip.com/articles/tom-cruise-mummy-30may17-17.jpg"
                },
                "4294712": {
                    "name": "Dick",
                    "id": 4294712,
                    "imageUrl": "http://afflictor.com/wp-content/uploads/2010/02/Dick_Cheney.jpg.jpeg"
                },
                "7728621": {
                    "name": "Harry",
                    "id": 7728621,
                    "imageUrl": "https://www.allthetests.com/quiz31/picture/pic_1404655017_1.jpg"
                }
            }

            $scope.connected = false;
            $scope.connectClick = function()
            {
                $scope.connected = !$scope.connected;
                if ($scope.connected)
                {
                    // Disconnect
                }
                else
                {
                    // Connect
                }
            }

            $scope.currentParticipantIndex = function()
            {
                if (!$scope.room) throw "Room is not defined or is empty";

                var currentSpeakerIndex = $scope.room.participants.indexOf($scope.room.currentSpeaker);
                if (currentSpeakerIndex < 0) throw "The current speaker isn't in the participants list";

                return currentSpeakerIndex;
            }

            $scope.getParticipantRelative = function(offset)
            {
                var targetIndex = $scope.currentParticipantIndex() + offset;


                // Wrap around
                while (targetIndex < 0) targetIndex += $scope.room.participants.length;
                while (targetIndex >= $scope.room.participants.length) targetIndex -= $scope.room.participants.length

                // Get the participant's ID
                var participantID = $scope.room.participants[targetIndex];

                // Make sure they exist in the user list
                if (!(participantID.toString() in $scope.users)) throw "The participant with id '" + participantID + "' does not exist in the user list";

                // Return the user data
                return $scope.users[participantID.toString()];
            }

            $scope.getParticipantByID = function(id)
            {
                if (!(id.toString() in $scope.users)) throw "The participant with id '" + id + "' does not exist in the user list";

                return $scope.users[id.toString()];
            }

            $scope.timeUntilNextTurn = () => Math.max(new Date($scope.room.nextTurn) - new Date(), 0);
            $scope.formattedTimeUntilNextTurn = () => Math.max(($scope.timeUntilNextTurn()/1000), 0).toFixed(2); // Just manually format the damn thing

            $scope.turnTimeRemaining = $scope.formattedTimeUntilNextTurn();
            $scope.updateTurnTimeRemaining = function()
            {
                $scope.turnTimeRemaining = $scope.formattedTimeUntilNextTurn();

                // Temporary for demonstration
                if ($scope.timeUntilNextTurn() <= 0)
                {
                    $scope.cycleParticipants();
                    $scope.room.nextTurn = new Date().getTime() + 10000;
                }
            }

            $interval($scope.updateTurnTimeRemaining, 41);

            $scope.cycleParticipants = function()
            {
                var newParticipantIndex = $scope.currentParticipantIndex() + 1;
                if (newParticipantIndex >= $scope.room.participants.length) newParticipantIndex = 0;
                $scope.room.currentSpeaker = $scope.room.participants[newParticipantIndex];
            }
        }
    ]
);
