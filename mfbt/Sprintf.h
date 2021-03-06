/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=8 sts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* Provides a safer sprintf for printing to fixed-size character arrays. */

#ifndef mozilla_Sprintf_h_
#define mozilla_Sprintf_h_

#include <stdio.h>
#include <stdarg.h>

#ifdef __cplusplus
template <size_t N>
#if defined(__GNUC__)
  __attribute__((format(printf, 2, 3)))
#endif
int SprintfLiteral(char (&buffer)[N], const char* format, ...)
{
  va_list args;
  va_start(args, format);
  int result = vsnprintf(buffer, N, format, args);
  va_end(args);
  buffer[N - 1] = '\0';
  return result;
}
#endif

#endif  /* mozilla_Sprintf_h_ */
