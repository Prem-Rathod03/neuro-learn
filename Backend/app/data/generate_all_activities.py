#!/usr/bin/env python3
"""
Script to generate all 82 activities and update activity_items.py
This avoids connection timeouts when writing large files directly.
"""

from typing import Optional, List
import sys
import os

# Add parent directory to path to import models
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../..'))

# We'll write the Python code as a string, then write it to the file
activities_code = '''"""
Example Activity Items - Can be stored in MongoDB or served directly
These match the ActivityItem schema
"""

from typing import Optional, List
from ..models.activity import ActivityItem, ActivityOption, ActivityAccessibility

# Example activities following the new schema
EXAMPLE_ACTIVITIES = [
'''

# Type mapping
type_map = {
    'instruction_to_image': 'one_step_instruction',
    'pattern_completion': 'pattern',
    'comparison_choice': 'comparison',
    'focus_task': 'focus_filter'
}

def convert_activity_to_python(activity_data):
    """Convert a TypeScript/JSON activity object to Python ActivityItem code"""
    activity_id = activity_data['id']
    module_id = activity_data['moduleId']
    lesson_id = activity_data['lessonId']
    
    # Convert type
    activity_type = activity_data['type']
    if activity_type in type_map:
        activity_type = type_map[activity_type]
    
    instruction = activity_data['instruction'].replace('"', '\\"')
    instruction_tts = activity_data.get('instructionTts', instruction).replace('"', '\\"')
    
    # Handle stimulus fields
    stimulus_image_url = activity_data.get('stimulusImageUrl')
    stimulus_image_alt = activity_data.get('stimulusImageAlt')
    stimulus_emoji = activity_data.get('stimulusEmoji')
    stimulus_description = activity_data.get('stimulusDescription', '').replace('"', '\\"')
    
    # Convert null to None
    if stimulus_image_url is None:
        stimulus_image_url_str = 'None'
    else:
        stimulus_image_url_str = f'"{stimulus_image_url}"'
    
    if stimulus_image_alt is None:
        stimulus_image_alt_str = 'None'
    else:
        stimulus_image_alt_str = f'"{stimulus_image_alt}"'
    
    if stimulus_emoji is None:
        stimulus_emoji_str = 'None'
    else:
        stimulus_emoji_str = f'"{stimulus_emoji}"'
    
    difficulty = activity_data['difficulty']
    
    # Build options
    options_code = '[\n'
    for opt in activity_data['options']:
        opt_id = opt['id'].replace('"', '\\"')
        opt_label = opt['label'].replace('"', '\\"')
        is_correct = opt['isCorrect']
        tts_text = opt.get('ttsText', opt_label).replace('"', '\\"')
        
        opt_code = f'            ActivityOption(id="{opt_id}", label="{opt_label}", isCorrect={is_correct}, ttsText="{tts_text}"'
        
        if opt.get('imageUrl'):
            opt_code += f', imageUrl="{opt["imageUrl"]}", imageAlt="{opt.get("imageAlt", "")}"'
        
        if opt.get('tags'):
            tags_str = '[' + ', '.join([f'"{tag}"' for tag in opt['tags']]) + ']'
            opt_code += f', tags={tags_str}'
        
        opt_code += '),\n'
        options_code += opt_code
    
    options_code += '        ]'
    
    # Build steps if present
    steps_code = ''
    if activity_data.get('steps'):
        steps_list = '[\n' + '\n'.join([f'            "{step.replace(chr(34), "\\"")}",' for step in activity_data['steps']]) + '\n        ]'
        steps_code = f'\n        steps={steps_list},'
    
    # Build accessibility
    acc = activity_data['accessibility']
    recommended_for = '[' + ', '.join([f'"{rf}"' for rf in acc['recommendedFor']]) + ']'
    accessibility_code = f'''        accessibility=ActivityAccessibility(
            recommendedFor={recommended_for},
            enableTtsOnHover={acc.get('enableTtsOnHover', False)},
            showProgressBar={acc.get('showProgressBar', False)},
            avoidMetaphors={acc.get('avoidMetaphors', True)},
            consistentFeedback={acc.get('consistentFeedback', True)}
        )'''
    
    # Build targetCategory and maxTimeSeconds if present
    extra_fields = ''
    if activity_data.get('targetCategory'):
        extra_fields += f'\n        targetCategory="{activity_data["targetCategory"]}",'
    if activity_data.get('maxTimeSeconds'):
        extra_fields += f'\n        maxTimeSeconds={activity_data["maxTimeSeconds"]},'
    
    # Build the complete activity
    activity_code = f'''    # {module_id}, {lesson_id} - {activity_id}
    ActivityItem(
        id="{activity_id}",
        moduleId="{module_id}",
        lessonId="{lesson_id}",
        type="{activity_type}",
        instruction="{instruction}",
        instructionTts="{instruction_tts}",'''
    
    if stimulus_image_url:
        activity_code += f'\n        stimulusImageUrl={stimulus_image_url_str},'
    if stimulus_image_alt:
        activity_code += f'\n        stimulusImageAlt={stimulus_image_alt_str},'
    if stimulus_emoji:
        activity_code += f'\n        stimulusEmoji={stimulus_emoji_str},'
    if stimulus_description:
        activity_code += f'\n        stimulusDescription="{stimulus_description}",'
    
    activity_code += f'''{steps_code}
        difficulty="{difficulty}",{extra_fields}
        options={options_code},
{accessibility_code}
    ),

'''
    
    return activity_code

# Read the user's activities from a file or paste them here
# For now, we'll create a template that the user can fill in
# Or we can parse from a JSON file

print("Activity generator script created!")
print("This script will help convert your activities to Python format.")
print("Next step: We'll create the complete file with all 82 activities.")

