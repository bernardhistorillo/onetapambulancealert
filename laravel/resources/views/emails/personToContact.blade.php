<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <style>
        * {
            font-family: Arial, serif;
        }

        .first-column {
            text-align:right;
            padding:15px 20px;
            border:1px solid white;
            border-bottom:0;
            font-weight: bold;
        }
        .second-column {
            text-align:left;
            padding:15px 20px;
            border:1px solid white;
            border-left:0;
            border-bottom:0;
        }
    </style>
</head>

<body>
    <table style="border:0; width:100%">
        <tr>
            <td style="text-align:center">
                <div style="background-color:#EEEEEE; display: inline-block; border-radius:30px; margin:30px 0; max-width:500px">
                    <div style="text-align:center; background-image:url('{{ asset('img/heading.webp') }}'); background-size:cover; background-repeat:no-repeat; background-position:center; border-radius:30px 30px 0 0; padding:20px">
                        <img src="{{ asset('img/otaa.png') }}" width="100" style="margin-bottom:10px" />
                        <h1 style="margin-top:5px; margin-bottom:10px; font-size:1.5em">Emergency</h1>
                    </div>

                    <div style="padding:0 40px 40px 40px ; text-align:center; font-size:1.2em">
                        Hello {{ $data['name'] }}, I'm sorry to inform you that an emergency has happened to {{ $data['subAccountName'] }}. He/She is now being transported to {{ $data['responderName'] }}.
                    </div>

                    <div style="text-align:center; margin-bottom:40px">
                        <a href="https://www.google.com/maps/{{ '@' . $data['responderLatitude'] . ',' . $data['responderLongitude'] }},17z" target="_blank" rel="noreferrer" style="background-color:#ff3b30; text-decoration:none; color:#ffffff; padding:10px 40px; font-weight:bold; border-radius:8px">View Location</a>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>
