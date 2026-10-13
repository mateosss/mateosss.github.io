#!/usr/bin/env python3
"""
Equivalent to the following markdown structure:

:::{.columns}
::: {.column width="50%"}
Left content
:::
::: {.column width="50%"}
Right content
:::
:::
"""


import panflute as pf


def parse_percentage(value):
    if value is None:
        return None

    text = str(value).strip()
    if not text:
        return None

    if text.endswith('%'):
        text = text[:-1].strip()

    try:
        number = float(text)
    except ValueError:
        return None

    if 0 <= number <= 100:
        return number

    return None


def format_percentage(value):
    if float(value).is_integer():
        return f"{int(value)}%"
    return f"{value}%"

def action(elem, doc):
    # We only care about Divs with the 'twocols' class
    if isinstance(elem, pf.Div) and 'twocols' in elem.classes:
        left_content = []
        right_content = []
        found_separator = False
        left_width = parse_percentage(elem.attributes.get('left'))
        right_width = parse_percentage(elem.attributes.get('right'))

        # If only one side is set, use the remaining width for the other side.
        if left_width is None and right_width is None:
            left_width = 50
            right_width = 50
        elif left_width is None:
            left_width = max(0, 100 - right_width)
        elif right_width is None:
            right_width = max(0, 100 - left_width)

        for child in elem.content:
            # Check for the horizontal rule (---) as the separator
            if isinstance(child, pf.HorizontalRule):
                found_separator = True
                continue

            if not found_separator:
                left_content.append(child)
            else:
                right_content.append(child)

        left_col = pf.Div(*left_content, classes=['column'], attributes={'width': format_percentage(left_width)})
        right_col = pf.Div(*right_content, classes=['column'], attributes={'width': format_percentage(right_width)})

        # Wrap them in a parent columns container
        return pf.Div(left_col, right_col, classes=['columns'])

if __name__ == '__main__':
    pf.run_filter(action)
