import panflute as pf
import urllib.request
import os
import hashlib

# Create a directory for cached thumbnails
CACHE_DIR = "res/youtube"
if not os.path.exists(CACHE_DIR):
    os.makedirs(CACHE_DIR)

def get_local_thumbnail(video_id):
    thumb_url = f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"
    # Create a unique filename based on the ID
    filename = f"{video_id}.jpg"
    local_path = os.path.join(CACHE_DIR, filename)

    # Download only if it doesn't exist locally
    if not os.path.exists(local_path):
        try:
            urllib.request.urlretrieve(thumb_url, local_path)
        except Exception as e:
            # Fallback to standard definition if maxres isn't available
            sd_url = f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"
            urllib.request.urlretrieve(sd_url, local_path)

    return local_path

def action(elem, doc):
    if isinstance(elem, pf.Link) and 'youtube' in elem.classes:
        video_id = elem.url
        caption = pf.stringify(elem)
        # Optional width (e.g. width=100% inside columns) and start/end seconds to show a short clip
        width = elem.attributes.get('width', '100vw')
        start = elem.attributes.get('start')
        end = elem.attributes.get('end')

        # height = getattr(elem, 'height', '100vh')

        # --- BEAMER (PDF) OUTPUT ---
        if doc.format == 'beamer':
            # 1. Download the image locally
            local_thumb = get_local_thumbnail(video_id)

            # 2. Use the local path in LaTeX
            # We use forward slashes for LaTeX compatibility even on Windows
            local_thumb_path = local_thumb.replace('\\', '/')

            latex_code = (
                r"\begin{figure}"
                r"\centering"
                f"\\href{{https://www.youtube.com/watch?v={video_id}}}"
                f"{{\\includegraphics[width=0.7\\linewidth]{{{local_thumb_path}}}}}"
                f"\\caption{{{caption}}}"
                r"\end{figure}"
            )
            return pf.RawInline(latex_code, format='tex')

        # --- REVEAL.JS (HTML) OUTPUT ---
        elif doc.format in ['revealjs', 'html', 'html5']:
            embed_url = f"https://www.youtube.com/embed/{video_id}?mute=1&loop=1&playlist={video_id}&controls=1&showinfo=0&rel=0&modestbranding=1&autoplay=0"
            if start:
                embed_url += f"&start={start}"
            if end:
                embed_url += f"&end={end}"
            html_code = (
                f'<div class="youtube-container" style="text-align:center;align-content:center;height:90%">'
                f'<iframe style="width:{width};aspect-ratio:16/9" src="{embed_url}" '
                f'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>'
                f'<p class="caption">{caption}</p>'
                f'</div>'
            )
            return pf.RawInline(html_code, format='html')

def main():
    return pf.run_filter(action)

if __name__ == '__main__':
    main()
