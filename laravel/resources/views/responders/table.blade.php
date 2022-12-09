<div class="table-responsive mb-3">
    <table class="table table-striped table-bordered data-table invisible">
        <thead>
            <tr>
                <th class="align-middle">Name</th>
                <th class="align-middle">Type</th>
                <th class="align-middle"></th>
                <th class="align-middle"></th>
            </tr>
        </thead>
        <tbody>
            @foreach($responders as $responder)
            <tr>
                <td class="align-middle">{{ $responder['name'] }}</td>
                <td class="align-middle">{{ $responder['type'] }}</td>
                <td class="align-middle text-center">
                    <a href="https://www.google.com/maps/search/?api=1&query={{ $responder['latitude'] }}%2C{{ $responder['longitude'] }}" target="_blank" class="btn btn-sm btn-outline-primary">View Location</a>
                </td>
                <td class="align-middle text-center">
                    <button class="btn btn-outline-primary btn-sm edit-responder-show-modal" value="{{ $responder['id'] }}" data-name="{{ $responder['name'] }}" data-type="{{ $responder['type'] }}" data-latitude="{{ $responder['latitude'] }}" data-longitude="{{ $responder['longitude'] }}">Edit</button>
                </td>
            </tr>
           @endforeach
        </tbody>
    </table>
</div>
