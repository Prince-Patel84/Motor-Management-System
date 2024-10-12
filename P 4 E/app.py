from flask import Flask, request, jsonify, render_template
import pandas as pd
import os

app = Flask(__name__)

# Path to the Excel file
EXCEL_FILE = 'motors.xlsx'

def read_motors_from_excel():
    if os.path.exists(EXCEL_FILE):
        try:
            df = pd.read_excel(EXCEL_FILE)
            df = df.fillna('')  # Replace NaN values with empty strings
            return df
        except Exception as e:
            print(f"Error reading Excel file: {e}")
            return pd.DataFrame()
    else:
        return pd.DataFrame()

def write_motors_to_excel(motors):
    df = pd.DataFrame(motors)
    try:
        df.to_excel(EXCEL_FILE, index=False)
    except Exception as e:
        print(f"Error writing to Excel file: {e}")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add-motors')
def add_motors():
    return render_template('add_motor.html')

@app.route('/view-motors')
def view_motors():
    return render_template('view_motors.html')

@app.route('/history')
def history():
    return render_template('history.html')

@app.route('/add-motor', methods=['POST'])
def add_motor():
    try:
        motor = request.json
        motors = read_motors_from_excel().to_dict(orient='records')
        motors.append(motor)
        write_motors_to_excel(motors)
        return jsonify({"status": "success"}), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred"}), 500

@app.route('/get-motors', methods=['GET'])
def get_motors():
    try:
        filters = request.args
        df = read_motors_from_excel()
        
        # Apply filters
        for key, value in filters.items():
            if value:
                df = df[df[key].astype(str).str.contains(value, case=False, na=False)]
        
        motors = df.to_dict(orient='records')
        return jsonify(motors)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred"}), 500
    
@app.route('/api/history', methods=['GET'])
def get_history():
    try:
        df = pd.read_excel('motors.xlsx')
        history_data = df[['OH Date', 'Job Description', 'R', 'Y', 'B', 'Location']]
        return history_data.to_json(orient='records')
    except Exception as e:
        return str(e), 500

# Function to load and process motor data
def get_motor_data():
    df = pd.read_excel(EXCEL_FILE)
    
    # Ensure the 'OH Date' column is converted to datetime format
    df['OH Date'] = pd.to_datetime(df['OH Date'], errors='coerce')
    
    return df

# @app.route('/stats')
# def get_stats():
#     """Return motor stats like total motors, maintenance due, and last serviced."""
#     df = get_motor_data()

#     # Total motors
#     total_motors = len(df)

#     # Maintenance due (entries with missing OH Date)
#     maintenance_due = df['OH Date'].isnull().sum()

#     # Last serviced (most recent OH Date)
#     last_serviced = df['OH Date'].max()

#     # Ensure last_serviced is a valid datetime object before applying strftime
#     if pd.notna(last_serviced) and isinstance(last_serviced, pd.Timestamp):
#         last_serviced_formatted = last_serviced.strftime('%Y-%m-%d')
#     else:
#         last_serviced_formatted = 'N/A'

#     stats = {
#         'total_motors': total_motors,
#         'maintenance_due': maintenance_due,
#         'last_serviced': last_serviced_formatted
#     }

#     return jsonify(stats)

if __name__ == '__main__':
    app.run(debug=True)
