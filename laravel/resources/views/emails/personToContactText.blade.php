Emergency

Hello {{ $data['name'] }}, I'm sorry to inform you that an emergency has happened to {{ $data['subAccountName'] }}. He/She is now being transported to {{ $data['responderName'] }}.

Location: https://www.google.com/maps/{{ '@' . $data['responderLatitude'] . ',' . $data['responderLongitude'] }},17z
