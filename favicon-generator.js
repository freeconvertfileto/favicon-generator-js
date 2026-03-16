(function() {
    var uploadArea = document.getElementById('faviconUploadArea');
    var browseBtn = document.getElementById('faviconBrowseBtn');
    var fileInput = document.getElementById('faviconFileInput');
    var workspace = document.getElementById('faviconWorkspace');
    var previewsEl = document.getElementById('faviconPreviews');
    var downloadAllBtn = document.getElementById('faviconDownloadAllBtn');
    var newBtn = document.getElementById('faviconNewBtn');

    var GROUPS = [
        {
            label: 'Browser Favicons',
            sizes: [
                { size: 16, name: 'favicon-16x16.png' },
                { size: 32, name: 'favicon-32x32.png' },
                { size: 48, name: 'favicon-48x48.png' },
                { size: 64, name: 'favicon-64x64.png' },
                { size: 128, name: 'favicon-128x128.png' },
                { size: 256, name: 'favicon-256x256.png' }
            ]
        },
        {
            label: 'Android / PWA',
            sizes: [
                { size: 192, name: 'android-chrome-192x192.png' },
                { size: 512, name: 'android-chrome-512x512.png' }
            ]
        },
        {
            label: 'iOS / iPhone',
            sizes: [
                { size: 57,  name: 'apple-touch-icon-57x57.png' },
                { size: 60,  name: 'apple-touch-icon-60x60.png' },
                { size: 72,  name: 'apple-touch-icon-72x72.png' },
                { size: 76,  name: 'apple-touch-icon-76x76.png' },
                { size: 114, name: 'apple-touch-icon-114x114.png' },
                { size: 120, name: 'apple-touch-icon-120x120.png' },
                { size: 144, name: 'apple-touch-icon-144x144.png' },
                { size: 152, name: 'apple-touch-icon-152x152.png' },
                { size: 180, name: 'apple-touch-icon-180x180.png' }
            ]
        }
    ];

    var canvases = {};
    var sourceImg = null;

    function loadImage(file) {
        if (!file || !file.type.startsWith('image/')) return;
        var reader = new FileReader();
        reader.onload = function(e) {
            sourceImg = new Image();
            sourceImg.onload = function() {
                buildPreviews();
                uploadArea.style.display = 'none';
                workspace.style.display = 'flex';
            };
            sourceImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function makeCanvas(size) {
        var cv = document.createElement('canvas');
        cv.width = size;
        cv.height = size;
        cv.getContext('2d').drawImage(sourceImg, 0, 0, size, size);
        return cv;
    }

    function buildPreviews() {
        previewsEl.innerHTML = '';
        canvases = {};

        GROUPS.forEach(function(group) {
            var section = document.createElement('div');
            section.className = 'favicon-group';

            var heading = document.createElement('div');
            heading.className = 'favicon-group-label';
            heading.textContent = group.label;
            section.appendChild(heading);

            var row = document.createElement('div');
            row.className = 'favicon-previews-row';

            group.sizes.forEach(function(entry) {
                var size = entry.size;
                var cv = makeCanvas(size);
                canvases[entry.name] = cv;

                var item = document.createElement('div');
                item.className = 'favicon-preview-item';

                var wrapper = document.createElement('div');
                wrapper.className = 'favicon-preview-canvas-wrapper';

                var displaySize = Math.min(size, 64);
                cv.style.width = displaySize + 'px';
                cv.style.height = displaySize + 'px';
                wrapper.appendChild(cv);

                var label = document.createElement('span');
                label.className = 'favicon-size-label';
                label.textContent = size + 'x' + size;

                var dlBtn = document.createElement('button');
                dlBtn.className = 'btn-secondary';
                dlBtn.textContent = 'Download';
                (function(n, c) {
                    dlBtn.addEventListener('click', function() { downloadCanvas(n, c); });
                })(entry.name, cv);

                item.appendChild(wrapper);
                item.appendChild(label);
                item.appendChild(dlBtn);
                row.appendChild(item);
            });

            section.appendChild(row);
            previewsEl.appendChild(section);
        });
    }

    function downloadCanvas(filename, cv) {
        var link = document.createElement('a');
        link.download = filename;
        link.href = cv.toDataURL('image/png');
        link.click();
    }

    if (downloadAllBtn) {
        downloadAllBtn.addEventListener('click', function() {
            if (typeof JSZip === 'undefined') {
                alert('JSZip not available. Please download files individually.');
                return;
            }
            var zip = new JSZip();
            var names = Object.keys(canvases);
            var pending = names.length;
            names.forEach(function(name) {
                canvases[name].toBlob(function(blob) {
                    zip.file(name, blob);
                    pending--;
                    if (pending === 0) {
                        zip.generateAsync({ type: 'blob' }).then(function(content) {
                            var link = document.createElement('a');
                            link.download = 'favicons.zip';
                            link.href = URL.createObjectURL(content);
                            link.click();
                            setTimeout(function() { URL.revokeObjectURL(link.href); }, 5000);
                        });
                    }
                }, 'image/png');
            });
        });
    }

    if (browseBtn) browseBtn.addEventListener('click', function(e) { e.stopPropagation(); fileInput.click(); });
    if (fileInput) fileInput.addEventListener('change', function() { if (fileInput.files.length) loadImage(fileInput.files[0]); });

    if (uploadArea) {
        uploadArea.addEventListener('click', function() { fileInput.click(); });
        uploadArea.addEventListener('dragover', function(e) { e.preventDefault(); uploadArea.classList.add('drag-over'); });
        uploadArea.addEventListener('dragleave', function() { uploadArea.classList.remove('drag-over'); });
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            if (e.dataTransfer.files.length) loadImage(e.dataTransfer.files[0]);
        });
    }

    if (newBtn) {
        newBtn.addEventListener('click', function() {
            fileInput.value = '';
            sourceImg = null;
            canvases = {};
            previewsEl.innerHTML = '';
            workspace.style.display = 'none';
            uploadArea.style.display = '';
        });
    }
})();
