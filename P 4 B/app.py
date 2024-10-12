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
    return render_template('add_motor.html')

@app.route('/view-motors')
def view_motors():
    return render_template('view_motors.html')

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

if __name__ == '__main__':
    app.run(debug=True)
