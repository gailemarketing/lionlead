# Content Guide

This application uses a JSON file to store the 30-day journey content.

## How to Edit Content

1.  Open the file: `src/data/journey.json`
2.  The file contains a list (array) of "Day" objects.
3.  To add a new day, copy an existing block (between `{` and `}`) and paste it after the last one (make sure to add a comma `,` between them).
4.  Edit the fields:
    *   `day`: The day number (e.g., 4).
    *   `title`: The headline for the day.
    *   `theme`: The category (e.g., "Culture", "Strategy").
    *   `action`: The specific task for the user to do.
    *   `script`: A helpful template for what they might say.
    *   `reflection_question`: What they should think about after doing the action.

## Example

```json
  {
    "day": 4,
    "title": "New Day Title",
    "theme": "New Theme",
    "action": "Description of the action...",
    "script": "I will say this...",
    "reflection_question": "What did I learn?"
  }
```

## Important Notes

*   Ensure the JSON format is valid (proper commas and quotes).
*   The application will automatically load whatever is in this file.
