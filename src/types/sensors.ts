/**
 * Sensor data type definitions
 */

/**
 * Accelerometer data (in G, where 1G ≈ 9.8 m/s²)
 */
export interface AccelData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

/**
 * Gyroscope data (in rad/s)
 */
export interface GyroData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

/**
 * Device Motion composite data
 */
export interface MotionData {
  acceleration: {
    x: number;
    y: number;
    z: number;
  };
  accelerationIncludingGravity: {
    x: number;
    y: number;
    z: number;
  };
  rotationRate: {
    x: number;
    y: number;
    z: number;
  };
  orientation: number; // Rotation around Z axis
  timestamp: number;
}

/**
 * Magnetometer heading data (in degrees)
 */
export interface MagnetometerData {
  heading: number; // 0-360 degrees
  accuracy: number; // In degrees
  timestamp: number;
}

/**
 * Processed sensor buffer for event detection
 */
export interface SensorBuffer {
  accel: AccelData[];
  gyro: GyroData[];
  motion: MotionData[];
  maxBufferSize: number;
}
