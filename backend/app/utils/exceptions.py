class InvalidInputException(Exception):
    def __init__(self, message: str):
        self.message = message

class NotFoundException(Exception):
    def __init__(self, args: object):
        self.not_found = args

class ConflictsException(Exception):
    def __init__(self):
        self.conflicts = "QMS"

class UserEmailExistsException(Exception):
    def __init__(self, user_email):
        self.user_email = user_email

class TokenException(Exception):
    def __init__(self, message: str):
        self.message = message