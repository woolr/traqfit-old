# app.py

from flask import Flask, render_template, request

app = Flask(__name__)

# Define a custom Jinja filter to format time as minutes and seconds
@app.template_filter('format_time')
def format_time(total_time):
    minutes = int(total_time)
    seconds = int((total_time - minutes) * 60)
    return f"{minutes} minutes {seconds} seconds"

# Define a function to calculate the total distance
def calculate_total_distance(miles, chunks):
    total_distance = miles * chunks * (1 / chunks)
    return total_distance

# Define a function to calculate the total time
def calculate_total_time(speeds,chunks):
    # Convert speeds from miles per hour to miles per minute
    speeds_per_minute = [speed / 60 for speed in speeds]
    
    # Calculate the total time in minutes
    total_time_minutes = sum(1 / speed_per_minute for speed_per_minute in speeds_per_minute) / chunks
    return total_time_minutes

# Define a function to calculate the pace
def calculate_pace(total_time, total_distance):
    pace = total_distance / (total_time / 60)  # Convert total time from minutes to hours
    return pace

@app.route('/')
def landing_page():
    """Route for the landing page"""
    return render_template('landing_page.html')

@app.route('/run_config', methods=['GET', 'POST'])
def run_config_page():
    """Route for the run configuration page"""
    if request.method == 'POST':
        # If the form is submitted, retrieve form data
        miles = int(request.form['miles'])
        chunks = int(request.form['chunks'])
    else:
        # If the page is accessed via URL parameters, retrieve them
        miles = int(request.args.get('miles'))
        chunks = int(request.args.get('chunks'))
    return render_template('run_config_page.html', miles=miles, chunks=chunks, int=int)

@app.route('/calculate_run', methods=['POST'])
def calculate_run():
    # Retrieve form data
    miles = int(request.form['miles'])
    chunks = int(request.form['chunks'])
    speeds = []
    for chunk in range(chunks):
        for mile in range(miles):
            speed = float(request.form[f'speeds_{mile}_{chunk}'])
            speeds.append(speed)

    # Calculate total distance, total time, and pace
    total_distance = calculate_total_distance(miles, chunks)
    total_time = calculate_total_time(speeds,chunks)
    pace = calculate_pace(total_time, total_distance)

    # Pass data to the results page
    return render_template('results_page.html', total_distance=total_distance, total_time=total_time, pace=pace, miles=miles, chunks=chunks, speeds=speeds, int=int)

if __name__ == '__main__':
    app.run(debug=True)
