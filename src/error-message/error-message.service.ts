// src/common/services/error-message.service.ts
import { Injectable } from '@nestjs/common';
type ErrorMessageKey = keyof typeof ErrorMessageService.prototype.messages;

@Injectable()
export class ErrorMessageService {
  public readonly messages = {
    NOT_FOUND: '{entity} not found', // Single key for "not found" errors
    INVALID_MINUTES: 'Invalid minutes value',
    INVALID_TIME_FORMAT: 'Invalid time format',
    USER_NOT_FOUND: '{entity} not found', // Can reuse NOT_FOUND if desired
    INTERNAL_SERVER_ERROR: 'Internal server error',
    ERROR_ADDING_TEMP_PASSWORD:
      'Error adding {type} temporary password from Tuya',
    INVALID_UUID: 'Invalid {entity} UUID',
    USER_ALREADY_BELONGS: 'This user already belongs to this {entity}',
    USER_HAS_NO_ENTITIES: 'This user has no {entity}',
    DEVICE_OPERATION_FAILED: 'All device operations failed',
    REQUEST_FAILED: 'Error processing {operation} request',
    COOLDOWN_ERROR:
      'Please wait {time} more seconds before requesting a new OTP.',
  };

  getMessage(
    key: ErrorMessageKey,
    params?: Record<string, string | number>,
  ): string {
    let message = this.messages[key] || 'Unknown error';

    // Replace placeholders with provided params
    if (params) {
      Object.keys(params).forEach((param) => {
        const regex = new RegExp(`{${param}}`, 'g');
        message = message.replace(regex, params[param].toString());
      });
    }

    return message;
  }
}
