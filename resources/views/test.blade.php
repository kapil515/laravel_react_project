<!DOCTYPE html>
<html>
<head>
    <title>Pusher Test</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script src="https://js.pusher.com/8.4.0/pusher.min.js"></script>
</head>
<body>
    <h1>Pusher Test</h1>

    <script>
        var pusher = new Pusher("{{ config('broadcasting.connections.pusher.key') }}", {
            cluster: "{{ config('broadcasting.connections.pusher.options.cluster') }}"
        });

        var channel = pusher.subscribe("test-channel");
        channel.bind("TestEvent", function(data) {
            alert("Got: " + JSON.stringify(data));
        });
    </script>
</body>
</html>
